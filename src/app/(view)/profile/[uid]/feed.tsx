"use client";

import React from "react";
import Link from "next/link";

import PostCard from "@/components/core/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserFeedQuery } from "@/redux/features/users/postApi";
import { UserData } from "@/lib/types/apiTypes";
import MyPostCard from "@/components/core/my-post-card";

export default function Feed({ my }: { my: UserData }) {
  const { id } = my;
  const { data, isLoading, isError, isFetching } = useGetUserFeedQuery({ id });

  const renderSkeletons = () => (
    <div className="flex flex-col gap-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full" />
      ))}
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
    data?.data?.data?.map((post: any, index: number) => (
      <MyPostCard
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
        {(isLoading || isFetching) && renderSkeletons()}
        {isError && renderError()}
        {!isLoading && !isError && data?.data?.data.length > 0 && renderPosts()}
      </div>
    </section>
  );
}
