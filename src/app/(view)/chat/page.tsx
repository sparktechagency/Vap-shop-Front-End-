"use client";

import ChatArea from "@/components/chat/ChatArea";
import UserList from "@/components/chat/UserList";
import { Message, User } from "@/lib/types/chatTypes";
import { useGetChatlistQuery, useGetAllmesageByidQuery, useSearchuserQuery, useSendMessageMutation, useLazyGetAllmesageByidQuery } from "@/redux/features/chat/ChatApi";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getSocket, initiateSocket, isSocketConnected } from "@/redux/service/socket";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";

interface ChatListUser extends User {
    lastMessage?: string;
    lastMessageTime?: string;
}

export default function Page() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [searchQuery, setSearchQuery] = useState(email || '');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Chat message state
    const [page, setPage] = useState(1);
    const per_page = 10;
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [uniqueMessageIds, setUniqueMessageIds] = useState<Set<number>>(new Set());

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // API calls
    const { data: chatlistData, isLoading: chatListLoading, refetch: refetchChat } = useGetChatlistQuery();
    const { data: searchData, isLoading: isSearchLoading } = useSearchuserQuery(
        { search: searchQuery },
        { skip: searchQuery.length < 2 }
    );
    const [getMessageData, messageResults] = useLazyGetAllmesageByidQuery();
    const { data: userInfo } = useGetOwnprofileQuery();
    // console.log();
    const [sendMessage] = useSendMessageMutation();

    // Socket connection
    const socket = getSocket();
    console.log('user id ', userInfo?.data?.id);
    // Initialize socket connection
    useEffect(() => {
        //   need scrolto 0 0 
        window.scrollTo(0, 150);

        if (isSocketConnected() && userInfo?.data?.id) {
            socket?.emit("join", { userId: userInfo?.data?.id });

            socket?.on("message", (data) => {
                // console.log(data);
                refetchChat();
                fetachMessage();
            });
        } else {
            initiateSocket();
        }

        return () => {
            socket?.off("message");
        };
    }, [selectedUser?.id, socket]);

    // Load more messages
    const loadMoreMessages = async (page: number) => {
        getMessageData({
            page: page,
            id: selectedUser?.id,
            per_page: 20
        }).then((res) => {
            console.log(res?.data?.data);
            // setAllMessages(res?.data?.data?.data)
            setAllMessages(prev => [...prev, ...res?.data?.data?.data]);
            // setPage(prev => prev + 1);
        })
    };
    const fetachMessage = async () => {
        getMessageData({
            page: 1,
            id: selectedUser?.id,
            per_page: 20
        }).then((res) => {
            // console.log(res?.data?.data);
            setAllMessages(res?.data?.data?.data)
            // setAllMessages(prev => [...prev, ...res?.data?.data?.data]);
            // setPage(prev => prev + 1);
        })
    };

    // console.log(allMessages);

    // Handle API messages
    useEffect(() => {
        fetachMessage()
        setPage(prev => prev + 1);
    }, [selectedUser?.id]);

    // User selection handler
    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setPage(1);
        setAllMessages([]);
        setUniqueMessageIds(new Set());
        setHasMore(true);
    };

    // Message sending handler
    const handleSendMessage = async (message: string) => {
        if (!selectedUser || !message.trim() || isSending) return;

        try {
            const response = await sendMessage({
                receiver_id: selectedUser.id,
                message
            }).unwrap();

            // console.log(response);

            if (response?.status) {
                fetachMessage()
            }
            socket?.emit("message", {
                receiverId: selectedUser.id,
                message: message
            });


        } catch (error) {

        } finally {
            setIsSending(false);
        }
    };



    // Scroll handler
    const handleScroll = () => {
        if (!chatContainerRef.current || isLoadingMore) return;
        const { scrollTop } = chatContainerRef.current;
        if (scrollTop === 0 && hasMore) {
            loadMoreMessages(page);
            setPage(prev => prev + 1);
        }
    };

    // Prepare user lists
    const chatListUsers: ChatListUser[] = chatlistData?.chat_list?.map((item: any) => ({
        ...item.user,
        lastMessage: item.message,
        lastMessageTime: item.created_at
    })) || [];

    const displayUsers = searchQuery.length >= 2 ? searchData?.data || [] : chatListUsers;




    return (
        <div className="md:!px-[7%] !px-4 !py-12 h-screen">
            <div className="w-full h-full grid grid-cols-7 gap-6">
                <UserList
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    users={displayUsers}
                    isLoading={searchQuery.length >= 2 ? isSearchLoading : chatListLoading}
                    onUserSelect={handleUserSelect}
                    showSearchEmptyState={searchQuery.length >= 2 && !searchData?.data?.length}
                    isChatList={searchQuery.length < 2}
                />
                <ChatArea
                    user={selectedUser}
                    messages={allMessages}
                    isLoading={messageResults?.isLoading}
                    isLoadingMore={messageResults?.isFetching}
                    isSending={isSending}
                    hasMore={hasMore}


                    onSendMessage={handleSendMessage}

                    onScroll={handleScroll}
                    chatContainerRef={chatContainerRef}
                    messagesEndRef={messagesEndRef}
                />
            </div>
        </div>
    );
}