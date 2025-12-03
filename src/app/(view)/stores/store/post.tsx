"use client";

import React from "react";
import Link from "next/link";

import PostCard from "@/components/core/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsByIdQuery } from "@/redux/features/users/postApi";
import { useGetProfileQuery } from "@/redux/features/AuthApi";
import MyPostCard from "@/components/core/my-post-card";

export default function Post({ id }: { id: number }) {
  const { data, isLoading, isError, isFetching, error } =
    useGetPostsByIdQuery<any>({
      id,
    });
  const { data: my } = useGetProfileQuery<any>({
    id: id,
  });

  if (isError) {
    return (
      <section className="py-6 flex items-center justify-center">
        {error?.data?.message ?? "Something went wrong"}
      </section>
    );
  }
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
        key={post?.id || index}
        user={{ name: my?.data?.full_name ?? "", avatar: my?.data.avatar }}
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
