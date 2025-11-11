/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUp,
  Edit3Icon,
  MessageCircle,
  Share2,
  Trash2Icon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  useCommentPostMutation,
  useDeletePostMutation,
  useGetCommentQuery,
} from "@/redux/features/users/postApi";
import Namer from "./internal/namer";
import { usePostLikeMutation } from "@/redux/features/others/otherApi";
import Link from "next/link";
import DOMPurify from "dompurify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import Image from "next/image";

const schema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export default function PostCard({
  data,
  user,
}: {
  data: any;
  user: {
    name: string;
    avatar: string;
  };
}) {
  const [liked, setLiked] = useState<boolean>(false);
  const [liking, setLiking] = useState(false);
  const { resolvedTheme } = useTheme();
  const [comment] = useCommentPostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: comments, refetch } = useGetCommentQuery({ id: data.id });
  const [likePost] = usePostLikeMutation();
  const [totalLike, setTotalLike] = useState(0);
  type FormSchema = z.infer<typeof schema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Like count: ", data?.like_count);
      setTotalLike(data?.like_count);
      setLiked(data?.is_post_liked);
    }
  }, [data]);
  console.log("data", data);

  const onSubmit = async (values: FormSchema) => {
    try {
      const response: { ok?: string } = await comment({
        post_id: data.id,
        comment: values.message,
      }).unwrap();

      if (!response.ok) {
        toast.error("Something went wrong!");
        return;
      }

      await refetch();
      toast.success("Commented successfully.");
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to comment. Please try again."
      );
      console.error("Comment failed:", error);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b !p-4">
        <Link
          href={
            String(data?.user?.role) === "3"
              ? `/brands/brand/${data.user_id}`
              : String(data?.user?.role) === "5"
              ? `/stores/store/${data?.user_id}`
              : `/profile/${data?.user_id}`
          }
          className="flex items-center gap-3 font-semibold text-base hover:font-bold hover:text-purple-500"
        >
          <Avatar className="size-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          {user.name}
        </Link>
      </div>
      {/* <div className="!p-4 border-b text-sm leading-relaxed font-semibold">
        {data?.title}
      </div> */}
      {/* Content */}
      {data?.post_images.slice(0, 1).map((x: any, i: number) => (
        <Image
          key={i}
          src={x.image_path}
          height={600}
          width={800}
          alt="post_image"
          className="max-h-[400px] mx-auto object-contain"
        />
      ))}
      {/* {data.article_image && (
        <div className="py-6">
          {data?.post_images?.map((x: string) => (
            <Image
              src={x}
              height={600}
              width={800}
              alt="post_image"
              className="max-h-[400px] mx-auto object-contain"
            />
          ))}

          <Image
            src={data.article_image}
            height={600}
            width={800}
            alt="post_image"
            className="max-h-[400px] mx-auto object-contain"
          />
        </div>
      )} */}
      <div
        className="!p-4 text-sm text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}
      />
      {/* Footer */}
      <div className="border-t !p-2 flex flex-row justify-between items-center bg-secondary">
        <div className="!space-x-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={liking}
            onClick={async () => {
              if (liking) return;

              const nextLiked = !liked;
              const nextTotalLike = totalLike + (nextLiked ? 1 : -1);

              // Optimistic UI update
              setLiked(nextLiked);
              setTotalLike(nextTotalLike);
              setLiking(true);

              try {
                const res = await likePost({ id: data.id }).unwrap();

                if (!res.ok) {
                  throw new Error("Failed to update like status.");
                }

                toast.success(`${nextLiked ? "Liked" : "Unliked"} post!`);
                refetch(); // optional: refresh from backend
              } catch (err: any) {
                // Revert optimistic update
                setLiked(!nextLiked);
                setTotalLike((prev) => prev + (nextLiked ? -1 : 1));

                toast.error(
                  err?.data?.message ||
                    "Something went wrong. Please try again."
                );
                console.error("Like error:", err);
              } finally {
                setLiking(false);
              }
            }}
            className="text-xs h-8 !px-3"
          >
            <ArrowBigUp
              className="w-4 h-4 !mr-1"
              fill={
                liked
                  ? resolvedTheme === "dark"
                    ? "#ffffff"
                    : "#191919"
                  : "transparent"
              }
            />
            {totalLike}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <MessageCircle className="mr-1" />
                {comments?.data?.data?.length || 0} Reply
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Reply to {user.name}</DialogTitle>
              <DialogDescription>{data.content}</DialogDescription>
              {comments?.data?.data.map((x: any) => (
                <div className="pt-6! border-t" key={x.id}>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={x.user.avatar} />
                      <AvatarFallback>UI</AvatarFallback>
                    </Avatar>
                    <Namer
                      name={x.user.full_name}
                      type={String(x.user.role_label).toLowerCase()}
                      size="sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2!">
                    {x.comment}
                  </p>
                </div>
              ))}
              <DialogFooter className="border-t !py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-row gap-3"
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Type here.." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant="special">
                      Send
                    </Button>
                  </form>
                </Form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button variant="ghost" asChild>
            <Link href={`/me/edit-post?id=${data.id}`}>
              <Edit3Icon />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost">
                <Trash2Icon className="text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are going to delete this post. this action can not be
                  undone
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive"
                  onClick={async () => {
                    const res = await deletePost({ id: data.id }).unwrap();
                    if (!res.ok) {
                      toast.error(res.message ?? "Failed to delete post");
                      return;
                    }
                    toast.success(res.message ?? "Successfully deleted post");
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost">
            <Share2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
