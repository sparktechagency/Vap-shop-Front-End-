"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IoCopySharp } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeartIcon, Loader2Icon } from "lucide-react";
import { useGetPostsQuery } from "@/redux/features/users/postApi";
import { useUser } from "@/context/userContext";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import {
  usePosHeartMutation,
  usePostLikeMutation,
} from "@/redux/features/others/otherApi";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
export default function Gallery() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [likePost, { isLoading: liking }] = usePosHeartMutation();
  const { data, isLoading, isError } = useGetPostsQuery();
  const my = useUser();

  const { resolvedTheme } = useTheme();
  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const renderSkeletons = () => (
    <div className="flex flex-col gap-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full" />
      ))}
    </div>
  );

  const renderHeader = () => (
    <div className="flex justify-end">
      <Button asChild>
        <Link href="/me/create-post">Upload a new post</Link>
      </Button>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground">No post found.</p>
      <Button variant="link" asChild>
        <Link href="/me/create-post">What’s on your mind?</Link>
      </Button>
    </div>
  );
  const renderPosts = () =>
    data?.data?.data
      ?.filter((post: any) => post.post_images && post.post_images.length > 0)
      ?.map((post: any, index: number) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <Card
              className="w-full relative aspect-[4/5] bg-cover rounded-none"
              style={{
                backgroundImage: `url('${post?.post_images[0].image_path}')`,
              }}
            >
              {post?.post_images?.length > 1 && (
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
                  {post.post_images.map((img: any, i: number) => (
                    <CarouselItem key={i}>
                      <div className="p-1">
                        <Card className="aspect-square! p-0!">
                          <CardContent className="flex aspect-square! items-center justify-center p-0! ">
                            <ImageZoom
                              onZoomChange={() => {
                                //keep dialog open
                              }}
                            >
                              <Image
                                src={img?.image_path}
                                height={500}
                                width={500}
                                alt={`Post image ${i + 1}`}
                                className="w-full h-full object-contain aspect-square rounded-md"
                              />
                            </ImageZoom>
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
              <Button
                variant="special"
                onClick={async () => {
                  try {
                    const res = await likePost({ id: post.id }).unwrap();

                    if (!res.ok) {
                      throw new Error("Failed to update like status.");
                    }

                    toast.success(
                      `${!post.is_hearted ? "Hearted" : "Unhearted"} post!`
                    );
                    // toast.success(`${post.is_ ? "Liked" : "Unliked"} post!`);
                  } catch (err: any) {
                    // Revert optimistic update
                    // setLiked(!nextLiked);
                    // setTotalLike((prev) => prev + (nextLiked ? -1 : 1));

                    toast.error(
                      err?.data?.message ||
                        "Something went wrong. Please try again."
                    );
                    console.error("Like error:", err);
                  }
                }}
                className="text-xs h-8 !px-3"
                disabled={liking}
              >
                <HeartIcon
                  className={cn("w-4 h-4 !mr-1", liking ? "hidden" : "")}
                  fill={
                    post.is_hearted
                      ? resolvedTheme === "dark"
                        ? "#ffffff"
                        : "#dc2626"
                      : "transparent"
                  }
                />
                {liking && <Loader2Icon className="animate-spin" />}
                {post.hearts_count}
              </Button>
            </DialogFooter>

            <div className="border-t mt-4 pt-4">
              <p
                className="text-xs text-muted-foreground line-clamp-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    post.content || "No description available."
                  ),
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      ));

  if (isLoading) return renderSkeletons();
  if (isError || !data?.data?.data?.length) return renderError();

  return (
    <div className="w-full pt-2">
      <div className="grid grid-cols-4 gap-0 relative mt-4">
        {renderPosts()}
      </div>

      <div className="w-full flex justify-center items-center mt-12">
        <Pagination className="mx-auto flex justify-center items-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            {[1].map((num) => (
              <PaginationItem key={num}>
                <PaginationLink>{num}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
