"use client";

import { useGetAllmesageByidQuery, useSendMessageMutation } from "@/redux/features/chat/ChatApi";
import { useState, useEffect, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { User, Message } from "@/lib/types/chatTypes";
import MessageBubble from "./MessageBubble";
import { Button } from "@/components/ui/button";

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
    const [uniqueMessageIds, setUniqueMessageIds] = useState<Set<number>>(new Set());

    const { data: messagesData, isLoading: isMessagesLoading } = useGetAllmesageByidQuery(
        { page, per_page, id: user?.id || 0 },
        { skip: !user?.id }
    );

    const [sendMessage] = useSendMessageMutation();

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    useEffect(() => {
        if (messagesData?.data?.data) {
            const newMessages = messagesData.data.data.filter(
                (msg: Message) => !uniqueMessageIds.has(msg.id)
            );

            if (newMessages.length === 0) {
                setHasMore(false);
                return;
            }

            setUniqueMessageIds(prev => {
                const newSet = new Set(prev);
                newMessages.forEach((msg: Message) => newSet.add(msg.id));
                return newSet;
            });

            setAllMessages(prev => {
                // For page 1, replace all messages
                if (page === 1) {
                    return [...newMessages].reverse(); // Reverse to show latest at bottom
                }
                // For subsequent pages, add to the beginning (older messages)
                return [...newMessages.reverse(), ...prev];
            });

            setHasMore(messagesData.data.current_page < messagesData.data.last_page);
            setIsLoadingMore(false);

            // If it's the first page, scroll to bottom
            if (page === 1) {
                scrollToBottom();
            }
        }
    }, [messagesData, page]);

    useEffect(() => {
        if (user?.id) {
            // Reset everything when user changes
            setPage(1);
            setAllMessages([]);
            setUniqueMessageIds(new Set());
            setHasMore(true);
        }
    }, [user?.id]);

    const handleSendMessage = async (message: string) => {
        if (!user || !currentUserId) return;

        const tempId = Date.now();
        const optimisticMessage: Message = {
            id: tempId,
            sender_id: currentUserId,
            receiver_id: user.id,
            message,
            created_at: new Date().toISOString(),
            is_read: false,
            is_sender: true
        };

        setAllMessages(prev => [...prev, optimisticMessage]);
        setUniqueMessageIds(prev => new Set(prev).add(tempId));

        try {
            const response = await sendMessage({
                receiver_id: user.id,
                message
            }).unwrap();

            setAllMessages(prev => prev.map(msg =>
                msg.id === tempId ? { ...response.data, is_sender: true } : msg
            ));
            setUniqueMessageIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(tempId);
                newSet.add(response.data.id);
                return newSet;
            });

            scrollToBottom("smooth");
        } catch (error) {
            console.error("Failed to send message:", error);
            setAllMessages(prev => prev.filter(msg => msg.id !== tempId));
            setUniqueMessageIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(tempId);
                return newSet;
            });
        }
    };

    const loadMoreMessages = () => {
        if (hasMore && !isLoadingMore) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    const handleScroll = () => {
        if (!chatContainerRef.current || isLoadingMore) return;

        const { scrollTop } = chatContainerRef.current;
        if (scrollTop === 0 && hasMore) {
            loadMoreMessages();
        }
    };

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
                                    key={`${message.id}-${message.created_at}`}
                                    message={message}
                                    isCurrentUser={message?.is_sender}
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