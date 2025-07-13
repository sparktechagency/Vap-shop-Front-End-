"use client";

import { useGetAllmesageByidQuery, useSendMessageMutation } from "@/redux/features/chat/ChatApi";
import { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { User, Message } from "@/lib/types/chatTypes";
import MessageBubble from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client"; // Socket.io ক্লায়েন্ট ইম্পোর্ট করুন

const SOCKET_SERVER_URL = "http://10.10.10.55"; // আপনার সকেট সার্ভারের URL

interface ChatAreaProps {
    user: User | null;
    currentUserId?: number;
}

export default function ChatArea({ user, currentUserId }: ChatAreaProps) {
    const [page, setPage] = useState(1);
    const per_page = 10;
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [uniqueMessageIds, setUniqueMessageIds] = useState<Set<number | string>>(new Set());
    const socketRef = useRef<Socket | null>(null); // সকেট রেফারেন্স

    const { data: messagesData, isLoading: isMessagesLoading } = useGetAllmesageByidQuery(
        { page, per_page, id: user?.id || 0 },
        { skip: !user?.id }
    );

    // REST API-এর মাধ্যমে মেসেজ পাঠানোর মিউটেশন এখন আর সরাসরি ব্যবহার হবে না, তবে রেখে দিতে পারেন যদি কোনো ফলব্যাক প্রয়োজন হয়।
    // const [sendMessage] = useSendMessageMutation();

    // ## ধাপ ৩: সকেট কানেকশন ও ডিসকানেকশন ##
    useEffect(() => {
        if (currentUserId) {
            // নতুন সকেট কানেকশন তৈরি করুন
            const newSocket = io(SOCKET_SERVER_URL, {
                query: { userId: currentUserId }, // userId প্যারামিটার হিসেবে পাঠান
            });
            socketRef.current = newSocket;

            newSocket.on('connect', () => {
                console.log('Socket connected successfully with id:', newSocket.id);
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            // কম্পোনেন্ট আনমাউন্ট হলে সকেট কানেকশন বন্ধ করুন
            return () => {
                newSocket.disconnect();
                socketRef.current = null;
            };
        }
    }, [currentUserId]);

    // ## ধাপ ৪: নতুন মেসেজের জন্য লিসেন করুন ##
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        // 'newMessage' ইভেন্টের জন্য লিসেন করুন (আপনার ব্যাকএন্ড ডেভেলপার যে ইভেন্টের নাম দিয়েছেন সেটি ব্যবহার করুন)
        const handleNewMessage = (newMessage: Message) => {
            // শুধুমাত্র চ্যাট যার সাথে চলছে, তার মেসেজ এলে UI-তে যোগ করুন
            if (newMessage.sender_id === user?.id || newMessage.receiver_id === user?.id) {
                // ডুপ্লিকেট মেসেজ এড়ানোর জন্য unique id চেক করুন
                if (!uniqueMessageIds.has(newMessage.id)) {
                    setAllMessages(prevMessages => [...prevMessages, newMessage]);
                    setUniqueMessageIds(prev => new Set(prev).add(newMessage.id));
                }
            }
        };

        socket.on('newMessage', handleNewMessage); // 'newMessage' আপনার ব্যাকএন্ড থেকে আসা ইভেন্টের নাম

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [user?.id, uniqueMessageIds]);


    useEffect(() => {
        if (messagesData?.data?.data) {
            const newMessages = messagesData.data.data.filter(
                (msg: Message) => !uniqueMessageIds.has(msg.id)
            );

            if (newMessages.length > 0) {
                setUniqueMessageIds(prev => {
                    const newSet = new Set(prev);
                    newMessages.forEach((msg: Message) => newSet.add(msg.id));
                    return newSet;
                });

                setAllMessages(prev => {
                    if (page === 1) {
                        return [...newMessages].reverse();
                    }
                    return [...newMessages.reverse(), ...prev];
                });
            }

            setHasMore(messagesData.data.current_page < messagesData.data.last_page);
            setIsLoadingMore(false);
        }
    }, [messagesData, page]);

    useEffect(() => {
        if (user?.id) {
            setPage(1);
            setAllMessages([]);
            setUniqueMessageIds(new Set());
            setHasMore(true);
        }
    }, [user?.id]);


    // ## ধাপ ৫: সকেটের মাধ্যমে মেসেজ পাঠান ##
    const handleSendMessage = async (message: string) => {
        if (!user || !currentUserId || !socketRef.current) return;

        // আপনার ব্যাকএন্ডের ফরম্যাট অনুযায়ী মেসেজ অবজেক্ট তৈরি করুন
        const messagePayload = {
            receiverId: String(user.id), // রিসিভারের আইডি
            message: message, // মেসেজ টেক্সট
        };

        const tempId = Date.now().toString(); // অস্থায়ী আইডি
        const optimisticMessage: Message = {
            id: tempId,
            sender_id: currentUserId,
            receiver_id: user.id,
            message,
            created_at: new Date().toISOString(),
            is_read: false,
            is_sender: true,
        };

        // UI-তে তাৎক্ষণিক মেসেজ দেখান
        setAllMessages(prev => [...prev, optimisticMessage]);
        setUniqueMessageIds(prev => new Set(prev).add(tempId));

        // 'sendMessage' ইভেন্টের মাধ্যমে সার্ভারে মেসেজ পাঠান (আপনার ব্যাকএন্ড ডেভেলপার যে ইভেন্টের নাম দিয়েছেন সেটি ব্যবহার করুন)
        socketRef.current.emit('sendMessage', messagePayload, (response: any) => {
            // সার্ভার থেকে প্রাপ্ত কনফার্মেশন মেসেজ দিয়ে UI আপডেট করুন
            if (response && response.data) {
                setAllMessages(prev => prev.map(msg =>
                    msg.id === tempId ? { ...response.data, is_sender: true } : msg
                ));
                setUniqueMessageIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(tempId);
                    newSet.add(response.data.id);
                    return newSet;
                });
            }
        });
    };

    const loadMoreMessages = () => {
        if (hasMore && !isLoadingMore) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    const handleScroll = () => {
        if (!chatContainerRef.current || isLoadingMore) return;
        if (chatContainerRef.current.scrollTop === 0 && hasMore) {
            loadMoreMessages();
        }
    };

    // নতুন মেসেজ এলে স্বয়ংক্রিয়ভাবে স্ক্রল করার জন্য
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);


    return (
        <div className="h-[calc(100vh-200px)] col-span-5 border rounded-lg flex flex-col justify-between items-start">
            {user ? (
                <>
                    <ChatHeader user={user} />
                    <div
                        ref={chatContainerRef}
                        className="flex-1 w-full p-4 overflow-y-auto"
                        onScroll={handleScroll}
                    >
                        {hasMore && (
                            <div className="flex justify-center mb-4">
                                <Button
                                    variant="outline"
                                    onClick={loadMoreMessages}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? 'Loading...' : 'Load Older Messages'}
                                </Button>
                            </div>
                        )}

                        {allMessages.length > 0 ? (
                            allMessages.map((message: Message) => (
                                <MessageBubble
                                    key={`${message.id}-${message.created_at}`} // key হিসেবে অস্থায়ী এবং আসল id উভয়ই কাজ করবে
                                    message={message}
                                    isCurrentUser={message.sender_id === currentUserId || message.is_sender}
                                />
                            ))
                        ) : isMessagesLoading ? (
                            <div className="text-center text-gray-500 py-8">
                                Loading messages...
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Start your conversation with {user.full_name}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <MessageInput
                        onSend={handleSendMessage}
                        disabled={!user}
                    />
                </>
            ) : (
                <div className="flex-1 w-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        Select a user to start chatting
                    </div>
                </div>
            )}
        </div>
    );
}