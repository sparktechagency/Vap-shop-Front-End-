/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";

import PostCard from "@/components/core/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsByIdQuery } from "@/redux/features/users/postApi";
import { useParams } from "next/navigation";
import { UserData } from "@/lib/types/apiTypes";

export default function Post({ user: my }: { user: UserData }) {
  const id = useParams().uid;

  const { data, isLoading, isError, isFetching, error } =
    useGetPostsByIdQuery<any>({
      id: id,
    });
  if (!isLoading) {
    if (isError) {
      console.log(error);
    } else {
      console.log(data);
    }
  }

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
    data?.data?.data?.map((post: any, index: number) => (
      <PostCard
        key={post.id || index} // Prefer post.id if available
        user={{ name: my.full_name ?? "", avatar: my.avatar }}
        data={post}
      />
    ));

  if (data) {
    console.log(data.data.data);
  }
  return (
    <section className="p-6!">
      <div className="my-12 space-y-6!">
        {renderHeader()}
        {(isLoading || isFetching) && renderSkeletons()}
        {isError && renderError()}
        {!isLoading && !isError && data?.data?.data.length > 0 && renderPosts()}
      </div>
    </section>
  );
}
