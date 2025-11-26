/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";

import PostCard from "@/components/core/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeedQuery } from "@/redux/features/users/postApi";

export default function Feed() {
  const { data, isLoading, isError, isFetching } = useGetFeedQuery();

  const renderSkeletons = () => (
    <div className="flex flex-col gap-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full" />
      ))}
    </div>
  );

  // const renderHeader = () => (
  //   <div className="flex justify-end">
  //     <Button asChild>
  //       <Link href="/me/create-post">Upload a new post</Link>
  //     </Button>
  //   </div>
  // );

  const renderError = () => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground">No post found.</p>
      <Button variant="link" asChild>
        <Link href="/me/create-post">What’s on your mind?</Link>
      </Button>
    </div>
  );

  const renderPosts = () =>
    data?.data?.data?.map((post: any, index: number) => (
      <PostCard
        key={post.id || index} // Prefer post.id if available
        user={{
          name: post?.user?.full_name ?? "Name not found",
          avatar: post?.user?.avatar,
        }}
        data={post}
      />
    ));

  return (
    <section className="p-6!">
      <div className="my-12 space-y-6!">
        {/* {renderHeader()} */}
        {(isLoading || isFetching) && renderSkeletons()}
        {isError && renderError()}
        {!isLoading && !isError && data?.data?.data.length > 0 && renderPosts()}
      </div>
    </section>
  );
}
