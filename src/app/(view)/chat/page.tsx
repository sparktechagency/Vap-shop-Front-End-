"use client";

import ChatArea from "@/components/chat/ChatArea";
import UserList from "@/components/chat/UserList";
import { Message, User } from "@/lib/types/chatTypes";
import { useGetChatlistQuery, useSearchuserQuery } from "@/redux/features/chat/ChatApi";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface ChatListUser extends User {
    lastMessage?: string;
    lastMessageTime?: string;
}

export default function Page() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    console.log('email', email);
    const [searchQuery, setSearchQuery] = useState(email || '');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Record<number, Message[]>>({});

    // Fetch chat list
    const { data: chatlistData, isLoading: chatListLoading } = useGetChatlistQuery();

    // Fetch search results (only when searchQuery has 2+ characters)
    const { data: searchData, isLoading: isSearchLoading } = useSearchuserQuery(
        { search: searchQuery },
        { skip: searchQuery.length < 2 }
    );
    console.log('searchdata', searchData);
    // Transform chat list data to match User type
    const chatListUsers: ChatListUser[] = chatlistData?.chat_list?.map((item: any) => ({
        ...item.user,
        lastMessage: item.message,
        lastMessageTime: item.created_at
    })) || [];

    // Determine which users to display
    const displayUsers = searchQuery.length >= 2 ? searchData?.data || [] : chatListUsers;

    const handleUserSelect = (user: User) => {
        setSelectedUser({
            id: user.id,
            full_name: user.full_name,
            avatar: user.avatar,
            role_label: user.role_label,
        });

        // Load messages for this user if not already loaded
        if (!messages[user.id]) {
            // You would typically fetch messages here
            setMessages(prev => ({
                ...prev,
                [user.id]: [] // Initialize empty, would be populated with actual messages
            }));
        }
    };

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
                    currentUserId={selectedUser?.id}
                    user={selectedUser}

                />
            </div>
        </div>
    );
}