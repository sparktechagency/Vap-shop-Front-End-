/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ReplyCard from "@/components/core/reply-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// Assuming the mutation is for creating comments, even if named useCreateArticalMutation
import {
  useCreateArticalMutation,
  useGetArtialByidQuery,
} from "@/redux/features/Trending/TrendingApi";
import { toast } from "sonner";

// --- Interfaces to match the API response ---
interface User {
  id: number;
  full_name?: string;
  avatar?: string;
}

// This interface now matches the structure of a single comment from your API
interface Comment {
  id: number;
  comment: string;
  created_at: string;
  user: User;
  replies: Comment[]; // For nested comments
}

// interface ArticleData {
//   id: number;
//   title: string;
//   content: string;
//   article_image: string;
//   created_at: string;
//   user: User;
//   comments: Comment[];
// }

// interface ApiResponse {
//   ok: boolean;
//   message: string;
//   data: ArticleData;
// }
// ---

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [comment, setComment] = useState("");

  // refetch is returned by the hook to refresh data after a mutation
  const { data, isLoading, isError, refetch } = useGetArtialByidQuery({ id });
  const [createComment, { isLoading: isCommenting }] =
    useCreateArticalMutation();

  const article = data?.data;

  const handleCreateComment = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    try {
      // The payload should match what your API expects
      const response = await createComment({
        post_id: id,
        comment: comment,
      }).unwrap();
      if (response.ok) {
        toast.success(response.message || "Comment posted successfully");
        setComment("");
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to post comment.");
    }
  };

  if (isLoading) {
    return (
      <main className="py-12 px-4 lg:px-[7%] text-center">
        <p>Loading article...</p>
      </main>
    );
  }

  if (isError || !article) {
    return (
      <main className="py-12 px-4 lg:px-[7%] text-center">
        <p>Error: Could not load the article.</p>
      </main>
    );
  }

  const postDate = new Date(article.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="py-12 px-4 lg:px-[7%]">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      <div className="flex flex-row justify-between items-center mb-8">
        <p className="text-muted-foreground text-sm">
          Posted by: {article.user.full_name}
        </p>
        <p className="text-muted-foreground text-sm">Date posted: {postDate}</p>
      </div>

      {article.article_image && (
        <div className="relative w-full aspect-video object-contain mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.article_image}
            alt={article.title}
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

      <article
        className="prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <Separator className="my-12" />

      <h2 className="text-2xl font-semibold mb-6">
        Comments ({article.comments.length})
      </h2>
      <div className="flex flex-row justify-between items-center gap-6">
        <Input
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          placeholder="Write a thoughtful comment..."
          disabled={isCommenting}
        />
        <Button onClick={handleCreateComment} disabled={isCommenting}>
          {isCommenting ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      {/* FIX: Correctly mapping over comments and passing props */}
      <div className="space-y-6 mt-12">
        {article.comments.length > 0 ? (
          article.comments.map((comment: Comment) => (
            <ReplyCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-muted-foreground text-center mt-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </main>
  );
}
