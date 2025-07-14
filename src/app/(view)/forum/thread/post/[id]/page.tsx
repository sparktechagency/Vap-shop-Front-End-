"use client";
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
import { Input } from "@/components/ui/input";
import {
  useCreatecommentMutation,
  useDeleteThreadMutation,
  useGetThreadDetailsByIdQuery,
  useLikeThreadMutation,
} from "@/redux/features/Forum/ForumApi";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import SafeHtml from "./safeHtml";
import Link from "next/link";
import { ArrowBigUpIcon, Trash2Icon } from "lucide-react";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostUpdate from "./update-post";

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
  const { data, isLoading, isError, refetch } =
    useGetThreadDetailsByIdQuery(id);
  const [createcomment, { isLoading: isCommentLoading }] =
    useCreatecommentMutation();
  const [threadUpvote] = useLikeThreadMutation();
  const [comment, setComment] = React.useState("");
  const { data: me, isLoading: meLoading } = useGetOwnprofileQuery();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteThread] = useDeleteThreadMutation();
  const navig = useRouter();
  const handleComment = async () => {
    if (!comment) return;
    try {
      const res = await createcomment({
        thread_id: Number(id),
        comment,
      });
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
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{thread.title}</h2>
            <div className="flex items-center gap-2">
              {!meLoading && thread.user.id === me.data.id && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Edit thread</Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[80dvw]">
                    <DialogHeader className="border-b pb-4!">
                      <DialogTitle className="text-sm! font-semibold ">
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

              {!meLoading && thread.user.id === me.data.id && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await deleteThread({
                        id: thread.id,
                      }).unwrap();
                      console.log(res);

                      if (!res.ok) {
                        toast.error(res.message);
                      } else {
                        toast.success(res.message);
                        navig.push("/forum");
                      }
                    } catch (error) {
                      console.error(error);
                      toast.error("Something went wrong");
                    }
                  }}
                >
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
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const res = await threadUpvote({ id: thread.id }).unwrap();
                  if (!res.ok) {
                    toast.error(res.message);
                    return;
                  } else {
                    toast.success(res.message);
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <ArrowBigUpIcon
                fill={thread.is_liked ? "#191919" : "#ffffff"}
                stroke={thread.is_liked ? "#191919" : "#000000"}
              />{" "}
              {thread.total_likes}
            </Button>
            {thread.views} view{thread.views !== 1 ? "s" : ""} •{" "}
            {thread.total_replies} comment
            {thread.total_replies !== 1 ? "s" : ""}
          </div>
        </CardFooter>
      </Card>
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
