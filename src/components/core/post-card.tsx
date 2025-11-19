/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUp,
  Edit3Icon,
  HeartIcon,
  MessageCircle,
  Share2,
  Trash2Icon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { ImageZoom } from "../ui/shadcn-io/image-zoom";
import { IoCopySharp } from "react-icons/io5";

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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
      <Dialog>
        <DialogTrigger asChild>
          <Card
            className="relative aspect-[4/5] w-1/3 mx-auto bg-cover bg-center rounded-none"
            style={{
              backgroundImage: `url('${data?.post_images[0].image_path}')`,
            }}
          >
            {data?.post_images?.length > 1 && (
              <div className="top-2 right-2 absolute z-20">
                <div className="text-background p-2 rounded-lg bg-background/30">
                  <IoCopySharp className="size-5" />
                </div>
              </div>
            )}
            <div className="h-full w-full absolute top-0 left-0 z-30 hover:bg-foreground/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer" />
          </Card>
        </DialogTrigger>

        <DialogContent className="h-[90dvh] !min-w-fit px-[4%]! gap-0!">
          <DialogHeader className="hidden">
            <DialogTitle />
          </DialogHeader>

          <div className="w-full flex justify-center items-center">
            <Carousel className="w-[60dvh]" setApi={setApi}>
              <CarouselContent>
                {data?.post_images?.map((img: any, i: number) => (
                  <CarouselItem key={i}>
                    <div className="p-1">
                      <Card className="aspect-square!">
                        <CardContent className="flex aspect-square! items-center justify-center p-0">
                          <Image
                            src={img?.image_path}
                            height={600}
                            width={400}
                            alt={`Post image ${i + 1}`}
                            className="w-full h-full object-cover aspect-square rounded-md"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="flex gap-2 mt-2 w-full justify-center items-center">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  current === i + 1
                    ? "bg-foreground w-4"
                    : "bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          <DialogFooter className="mt-0 pt-0 flex justify-start items-center">
            <Button variant="special">
              <HeartIcon /> {data.likes_count ?? 0}
            </Button>
          </DialogFooter>

          {/* <div className="border-t mt-4 pt-4">
            <p
              className="text-xs text-muted-foreground line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  data.content || "No description available."
                ),
              }}
            />
          </div> */}
        </DialogContent>
      </Dialog>
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
