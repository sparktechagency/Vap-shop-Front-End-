"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

// --- Interfaces for the component's props ---
// These should match the types used in your Page component
interface User {
  id: number;
  full_name?: string;
  avatar?: string;
}

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  user: User;
}

// Define the props that the ReplyCard component will accept
interface ReplyCardProps {
  comment: Comment;
}
// ---

export default function ReplyCard({ comment }: ReplyCardProps) {
  const [mounted, setMouted] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client, preventing hydration mismatches.
    setMouted(true);
  }, []);

  // Helper to get initials from a name for the avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Render a loader until the component is mounted on the client
  if (!mounted) {
    return (
      <div className="!py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-3 font-semibold text-base">
          <Avatar className="size-10">
            {/* Dynamic user avatar */}
            <AvatarImage src={comment.user.avatar} className="object-cover" />
            <AvatarFallback>{getInitials(comment.user.full_name)}</AvatarFallback>
          </Avatar>
          {/* Dynamic user name */}
          {comment.user.full_name}
        </div>
      </div>

      {/* Content */}
      <div className="!p-4 text-xs md:text-sm text-muted-foreground">
        {/* Dynamic comment text */}
        {comment.comment}
      </div>
    </div>
  );
}
