"use client";

import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types/chatTypes";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { useMarkAsReadMessageMutation } from "@/redux/features/chat/ChatApi";
import { toast } from "sonner";

interface UserItemProps {
  user: User & {
    lastMessage?: string;
    lastMessageTime?: string;
    unread_messages_count?: number | string;
    sender_id?: number;
  };
  onClick: (user: User) => void;
  showLastMessage?: boolean;
}

export default function UserItem({
  user,
  onClick,
  showLastMessage = false,
}: UserItemProps) {
  const [markAsReadMessage] = useMarkAsReadMessageMutation();

  const handleUserClick = async () => {
    // Only call the API if there are unread messages
    if (user?.id && Number(user.unread_messages_count) > 0) {
      try {
        const response = await markAsReadMessage({
          id: user.sender_id,
        }).unwrap();

        if (response?.ok) {
          toast.success(response?.message);
        }
      } catch (error) {
        console.error("Failed to mark as read:", error);
        toast.error("Failed to mark as read.");
      }
    }

    onClick(user);
  };

  return (
    <div
      className="flex flex-row justify-start items-center gap-6 !px-6 !py-3 border-b cursor-pointer hover:bg-gray-50"
      onClick={handleUserClick}
    >
      <Avatar className="!size-12">
        <AvatarImage src={user.avatar || "/image/icon/user.jpeg"} />
        <AvatarFallback>
          {user.full_name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="overflow-hidden flex-1">
        <div className="flex justify-between items-start relative">
          <Namer name={user.full_name} size="sm" type="brand" />
          {showLastMessage && user.lastMessageTime && (
            <span className="text-xs text-gray-500">
              {format(new Date(user.lastMessageTime), "HH:mm")}
            </span>
          )}
          {user?.role_label?.toLowerCase() === "store" && (
            <p className="text-xs text-gray-500 truncate">
              {user.phone ||
                user.phone ||
                user?.phone ||
                "No phone number available"}
            </p>
          )}
          {Number(user?.unread_messages_count) > 0 && (
            <Badge variant="destructive" className="absolute top-0 right-12">
              {user?.unread_messages_count}
            </Badge>
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
      </div>
    </div>
  );
}
