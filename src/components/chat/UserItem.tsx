"use client";

import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types/chatTypes";
import { format } from "date-fns";

interface UserItemProps {
    user: User & {
        lastMessage?: string;
        lastMessageTime?: string;
    };
    onClick: (user: User) => void;
    showLastMessage?: boolean;
}

export default function UserItem({ user, onClick, showLastMessage = false }: UserItemProps) {
    return (
        <div
            className="flex flex-row justify-start items-center gap-6 !px-6 !py-3 border-b cursor-pointer hover:bg-gray-50"
            onClick={() => onClick(user)}
        >
            <Avatar className="!size-12">
                <AvatarImage src={user.avatar || "/image/icon/user.jpeg"} />
                <AvatarFallback>
                    {user.full_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden flex-1">
                <div className="flex justify-between items-start">
                    <Namer name={user.full_name} size="sm" type="brand" />
                    {showLastMessage && user.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                            {format(new Date(user.lastMessageTime), 'HH:mm')}
                        </span>
                    )}
                </div>
                {showLastMessage ? (
                    <p className="text-sm text-gray-500 truncate">
                        {user.lastMessage || "No messages yet"}
                    </p>
                ) : (
                    <p className="text-sm text-purple-500 font-bold truncate">
                        {user.role_label || "User"}
                    </p>
                )}
                {user.phone && !showLastMessage && (
                    <p className="text-xs text-gray-500 truncate">{user.phone}</p>
                )}
            </div>
        </div>
    );
}