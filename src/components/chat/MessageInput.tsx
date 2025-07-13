"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MessageInputProps {
    disabled?: boolean;
    onSendMessage: (message: string) => void;

}

export default function MessageInput({ disabled = false, onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-row justify-between w-full !p-6 gap-6">
            <Input
                placeholder="Type a message..."
                disabled={disabled}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" disabled={disabled || !message.trim()}>
                Send
            </Button>
        </form>
    );
}