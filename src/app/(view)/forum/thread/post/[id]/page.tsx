"use client";
import CommentCard from "@/components/core/comment-card";
import GoBack from "@/components/core/internal/go-back";
import LoadingScletion from "@/components/LoadingScletion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreatecommentMutation,
  useGetThreadDetailsByIdQuery,
} from "@/redux/features/Forum/ForumApi";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface User {
  id: number;
  first_name: string;
  last_name: string | null;
  role: number;
  role_label: string;
  full_name: string;
  total_followers: number;
  total_following: number;
  is_following: boolean;
  avg_rating: number;
  total_reviews: number;
  avatar?: string;
}

interface Group {
  id: number;
  title: string;
  total_threads: number;
  total_comments: number;
}

interface Comment {
  id: number;
  comment: string; // Changed from 'body' to match your data
  user_id: number;
  thread_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user: User;
}

interface ThreadDetails {
  id: number;
  title: string;
  body: string;
  views: number;
  user_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  total_replies: number;
  user: User;
  group: Group;
  comments: Comment[];
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } =
    useGetThreadDetailsByIdQuery(id);
  const [createcomment, { isLoading: isCommentLoading }] =
    useCreatecommentMutation();
  const [comment, setComment] = React.useState("");
  const handleComment = async () => {
    if (!comment) return;
    try {
      const res = await createcomment({
        thread_id: Number(id),
        comment,
      });
      console.log("res", res);
      if (res?.data?.ok) {
        toast.success("Comment created successfully");
        setComment("");
        refetch();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to create comment");
    }
  };
  if (isLoading) {
    return <LoadingScletion />;
  }

  if (isError) {
    return <div>Error loading thread details</div>;
  }

  if (!data) {
    return <div>No thread data found</div>;
  }

  const thread = data?.data as ThreadDetails;

  console.log("thread", thread);
  return (
    <main className="!my-12 !px-4 lg:!px-[7%] !space-y-12">
      <GoBack />
      <Card className="flex flex-row justify-between items-center">
        <CardHeader className="flex flex-row justify-between w-full h-full">
          <div className="flex flex-row gap-4 h-full items-center">
            <Avatar className="size-26">
              <AvatarImage src={thread.user?.avatar} />
              <AvatarFallback>
                {thread.user?.first_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="!h-full flex flex-col justify-center">
              <h3 className="text-base md:text-xl font-bold">
                {thread.user?.full_name || "Unknown User"}
              </h3>
              <div className="!space-x-2 !space-y-2">
                <Badge>{thread.user?.role_label || "User"}</Badge>
                {thread.user?.avg_rating ? (
                  <Badge variant="special">
                    {thread.user.avg_rating.toFixed(1)} ★
                  </Badge>
                ) : null}
                <Badge variant="outline">
                  {thread.user?.total_reviews || 0} reviews
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(thread.created_at).toLocaleString()}
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold">{thread.title}</h2>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
            {thread.body}
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            {thread.views} view{thread.views !== 1 ? "s" : ""} •{" "}
            {thread.total_replies} comment
            {thread.total_replies !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="text-md font-semibold mb-2">
            Group: {thread.group?.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {thread.group?.total_threads} threads •{" "}
            {thread.group?.total_comments} comments
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-4">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          type="text"
          placeholder="what's on your mind??"
          className="text-xs sm:text-sm lg:text-base"
        />
        <Button onClick={handleComment}>
          {isCommentLoading ? "Loading..." : "Comment"}
        </Button>
      </div>
      <Card>
        <CardContent className="!space-y-4">
          {thread.comments?.length > 0 ? (
            thread.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
