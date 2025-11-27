"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useGetChatlistQuery } from "@/redux/features/chat/ChatApi";
import { InboxIcon, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Define the type for the chat item props
interface InboxCardProps {
  data: {
    id: number;
    message: string;
    created_at: string;
    user: {
      full_name: string;
      avatar: string;
    };
    unread_messages_count: number;
  };
}

// The InboxCard component is now defined inside the same file
const InboxCard: React.FC<InboxCardProps> = ({ data }) => {
  // State to hold the client-side rendered time string to prevent hydration errors
  const [timeAgo, setTimeAgo] = useState("");

  // This effect runs only on the client, after the initial render
  useEffect(() => {
    // Calculate the relative time and update the state.
    setTimeAgo(
      formatDistanceToNow(new Date(data.created_at), { addSuffix: true })
    );
  }, [data.created_at]);

  // Function to get initials from a name for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Link
      href={`/chat`}
      className="w-full p-3 flex items-center space-x-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
    >
      {/* Avatar */}
      <Avatar className="h-14 w-14">
        <AvatarImage src={data.user.avatar} alt={data.user.full_name} />
        <AvatarFallback>{getInitials(data.user.full_name)}</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-md font-semibold truncate">
            {data.user.full_name}
          </p>
        </div>
        <p
          className={`text-sm text-gray-500 truncate ${
            data.unread_messages_count > 0 ? "font-bold text-gray-800" : ""
          }`}
        >
          {data.message}
        </p>
      </div>

      {/* Timestamp and Unread Badge */}
      <div className="flex flex-col items-end space-y-1">
        <p className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</p>
        {data.unread_messages_count > 0 && (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-2 py-0.5">
            {data.unread_messages_count}
          </Badge>
        )}
      </div>
    </Link>
  );
};

export default function Page() {
  // Fetching the chat list data from the API
  const { data: chatListData, isLoading } = useGetChatlistQuery();

  // Show a loading animation while data is being fetched
  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2">Loading Chats...</p>
      </div>
    );
  }

  // The chat data from the API response (assuming it's an array)
  const chats = chatListData?.chat_list || [];

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold mb-4 px-4">Inbox</h1>
      <div className="border rounded-lg bg-white shadow-sm">
        {chats.length > 0 ? (
          // If chats exist, map over them and render the local InboxCard for each one
          chats.map((chat: any) => <InboxCard key={chat.id} data={chat} />)
        ) : (
          // If there are no chats, display an "Empty Inbox" message
          <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
            <InboxIcon className="size-16 mb-4" />
            <h3 className="text-xl font-semibold">Your Inbox is Empty</h3>
            <p>You have no messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
