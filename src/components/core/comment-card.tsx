"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface User {
  id: number;
  first_name: string;
  last_name: string | null;
  full_name: string;
  avatar?: string;
  role?: number;
}

interface Comment {
  id: number;
  comment: string; // Changed from 'body' to match your data
  created_at: string;
  updated_at: string;
  user: User;
}

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="border-b !p-4">
        <div className="flex items-center gap-3 font-semibold text-base">
          <Avatar className="size-10">
            <AvatarImage src={comment.user?.avatar} />
            <AvatarFallback>
              {comment.user?.first_name?.charAt(0) || "U"}
              {comment.user?.last_name?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link
              href={
                comment?.user.role === 5
                  ? `/stores/store/${comment?.user.id}`
                  : comment?.user.role === 4
                  ? `/brands/brand/${comment?.user.id}`
                  : `/profile/${comment?.user.id}`
              }
            >
              {comment.user?.full_name || "Unknown User"}
            </Link>
            <span className="text-xs text-muted-foreground font-normal">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="!p-4 text-xs md:text-sm text-muted-foreground">
        {comment.comment} {/* Changed from comment.body to comment.comment */}
      </div>
    </div>
  );
}
