"use client";

import React from "react";
import Link from "next/link";

import PostCard from "@/components/core/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsByIdQuery } from "@/redux/features/users/postApi";
import { useParams } from "next/navigation";
import { UserData } from "@/lib/types/apiTypes";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import MyPostCard from "@/components/core/my-post-card";

export default function Post({ user: my }: { user: UserData }) {
  const id = useParams().uid;
  const { data, isLoading, isError, isFetching, error } =
    useGetPostsByIdQuery<any>({
      id: id,
    });
  const { data: me } = useGetOwnprofileQuery<any>();

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
    data?.data?.data
      ?.slice()
      .reverse()
      .map((post: any, index: number) => (
        <MyPostCard
          key={post.id || index}
          user={{ name: my.full_name ?? "", avatar: my.avatar }}
          data={post}
          admin={me.data.role === 1}
          manage={me.data.role === 1}
        />
      ));

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
