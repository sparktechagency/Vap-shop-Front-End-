"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import CommentCard from "@/components/core/comment-card";
import GoBack from "@/components/core/internal/go-back";
import LoadingScletion from "@/components/LoadingScletion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCreatecommentMutation,
  useDeleteThreadMutation,
  useGetThreadDetailsByIdQuery,
  useLikeThreadMutation,
} from "@/redux/features/Forum/ForumApi";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import SafeHtml from "./safeHtml";
import Link from "next/link";
import { ArrowBigUpIcon, EditIcon, Trash2Icon } from "lucide-react";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostUpdate from "./update-post";
import { Editor } from "primereact/editor";

// --- Interface Definitions ---
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
  comment: string;
  user_id: number;
  thread_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user: User;
  is_liked: boolean;
  total_likes: number;
}

export interface ThreadDetails {
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
  is_liked: boolean;
  total_likes: number;
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // --- State and Data Fetching ---
  const [comment, setComment] = React.useState<any>();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data, isLoading, isError, refetch, error } =
    useGetThreadDetailsByIdQuery(id);
  const { data: me, isLoading: meLoading } = useGetOwnprofileQuery();

  const [createcomment, { isLoading: isCommentLoading }] =
    useCreatecommentMutation();
  const [threadUpvote] = useLikeThreadMutation();
  const [deleteThread] = useDeleteThreadMutation();

  // --- Event Handlers ---
  const handleComment = async () => {
    if (!comment) return;
    try {
      const res = await createcomment({
        thread_id: Number(id),
        comment,
      }).unwrap();

      if (res?.ok) {
        toast.success("Comment created successfully");
        setComment("");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to create comment");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteThread({ id: thread.id }).unwrap();
      if (!res.ok) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/forum");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting the thread.");
    }
  };

  const handleLike = async () => {
    try {
      const res = await threadUpvote({ id: thread.id }).unwrap();
      if (!res.ok) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while liking the thread.");
    }
  };
  // --- Render States ---
  if (isLoading) {
    return <LoadingScletion />;
  }

  if (isError && error) {
    if ("status" in error) {
      const errorData = error.data as { message?: string };
      return <div>{errorData?.message || "An error occurred"}</div>;
    } else {
      return <div>{error.message || "An unknown error occurred"}</div>;
    }
  }

  // FIX: Added a more robust check for nested data to prevent crashes.
  if (!data?.data) {
    return <div>No thread data found. It might have been deleted.</div>;
  }

  const thread = data.data as ThreadDetails;

  // FIX: Safely check if the current user's data exists and matches the thread author.
  const isOwner = !meLoading && me?.data?.role === thread.user.role;
  const isAdmin = !meLoading && me?.data?.role === 1;

  return (
    <main className="!my-12 !px-4 lg:!px-[7%] !space-y-12">
      <GoBack />

      {/* --- Author Information Card --- */}
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
              <Link
                href={
                  thread?.user.role === 5
                    ? `/stores/store/${thread?.user.id}`
                    : thread?.user.role === 4
                    ? `/brands/brand/${thread.user.id}`
                    : `/profile/${thread?.user.id}`
                }
                className="text-base md:text-xl font-bold hover:text-primary/80"
              >
                {thread.user?.full_name || "Unknown User"}
              </Link>
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

      {/* --- Thread Content Card --- */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-bold">{thread.title}</h2>
              <div className="">
                {thread.user.role === me.data.role && (
                  <Button variant={"outline"} asChild>
                    <Link href={`${window.location.pathname}/edit`}>
                      <EditIcon />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(isOwner || isAdmin) && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Edit thread</Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[80dvw]">
                    <DialogHeader className="border-b pb-4!">
                      <DialogTitle className="text-sm! font-semibold">
                        Update this thread
                      </DialogTitle>
                    </DialogHeader>
                    <PostUpdate
                      groupId={String(thread.group_id)}
                      id={String(thread.id)}
                      closer={() => setDialogOpen(false)}
                      data={thread}
                    />
                  </DialogContent>
                </Dialog>
              )}

              {(isOwner || isAdmin) && (
                <Button size="icon" variant="outline" onClick={handleDelete}>
                  <Trash2Icon className="text-destructive" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SafeHtml html={thread.body} />
        </CardContent>
        <CardFooter className="border-t flex items-center">
          <div className="mt-2! text-sm text-muted-foreground flex items-center gap-4">
            <Button variant="outline" onClick={handleLike}>
              <ArrowBigUpIcon
                fill={thread.is_liked ? "#191919" : "none"}
                className={thread.is_liked ? "text-white" : "text-black"}
              />
              <span className="ml-2">{thread.total_likes}</span>
            </Button>
            {thread.views} view{thread.views !== 1 ? "s" : ""} •{" "}
            {thread.total_replies} comment
            {thread.total_replies !== 1 ? "s" : ""}
          </div>
        </CardFooter>
      </Card>

      {/* --- Group Info Card --- */}
      <Card>
        <CardContent>
          <h3 className="text-md font-semibold mb-2">
            Group: {thread.group?.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {thread.group?.total_threads} threads •{" "}
              {thread.group?.total_comments} comments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* --- New Comment Input --- */}
      <div className="flex flex-row gap-4">
        <Editor
          value={comment}
          // onChange={(e) => setComment(e.target.value)}
          onTextChange={(e) => setComment(e.htmlValue)}
          type="text"
          placeholder="What's on your mind?"
          className="text-xs sm:text-sm lg:text-base w-full"
        />
      </div>
      <div className="flex justify-end items-end">
        <Button onClick={handleComment} disabled={isCommentLoading}>
          {isCommentLoading ? "Posting..." : "Comment"}
        </Button>
      </div>

      {/* --- Comments Section --- */}
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
