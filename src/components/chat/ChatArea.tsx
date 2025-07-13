"use client";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { User, Message } from "@/lib/types/chatTypes";
import MessageBubble from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { useEffect, useLayoutEffect } from "react";

interface ChatAreaProps {
    user: User | null;
    messages: Message[];
    isLoading: boolean;
    isSending: boolean;
    hasMore: boolean;
    isLoadingMore: boolean;
    onSendMessage: (message: string) => void;
    onScroll: () => void;
    chatContainerRef: React.RefObject<HTMLDivElement | null>
    messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export default function ChatArea({
    user,
    messages,
    isLoading,
    isSending,
    hasMore,
    isLoadingMore,

    onSendMessage,

    onScroll,
    chatContainerRef,
    messagesEndRef
}: ChatAreaProps) {


    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className=" h-[calc(100vh-100px)]  col-span-5 border rounded-lg flex flex-col justify-between items-start">
            {user ? (
                <>
                    <ChatHeader user={user} />
                    <div
                        ref={chatContainerRef}
                        className="flex-1 w-full p-4 overflow-y-auto"
                        onScroll={onScroll}
                    >
                        {/* {hasMore && (
                            <div className="flex justify-center mb-4">
                                <Button
                                    variant="outline"
                                    loadMoreMessages={() => setPage(prev => prev + 1)}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? 'Loading...' : 'Load Older Messages'}
                                </Button>
                            </div>
                        )} */}
                        {
                            isLoadingMore && (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-600"></div>
                                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-600"></div>
                                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-600"></div>
                                </div>
                            )
                        }

                        {messages?.length > 0 ? (
                            [...messages]
                                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                .map((message: Message) => (
                                    <MessageBubble
                                        key={`${message.id}-${message.created_at}`}
                                        message={message}
                                        isCurrentUser={message?.is_sender}
                                    />
                                ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Start your conversation with {user.full_name}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                    <MessageInput
                        onSendMessage={onSendMessage}
                        disabled={!user || isSending}
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