/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React from "react";
import Link from "next/link";
// import ReviewCard from "@/components/core/review-card";
import { Button } from "@/components/ui/button";
import { useGetMyReviewsQuery } from "@/redux/features/users/userApi";
import { Loader2Icon } from "lucide-react";
import LatestReviewCard from "@/components/core/latest-review-card";
import { UserData } from "@/lib/types/apiTypes";

export default function LatestRevs({ user }: { user: UserData }) {
  const { data, isLoading, isError, refetch } = useGetMyReviewsQuery({
    id: user.id,
  });
  const reviews = data?.data;
  if (data) {
    console.log(data);
  }

  if (isLoading) {
    return (
      <div className="!p-6 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (isError || !Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="!p-6 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No reviews found.
        </p>
        <Button variant="link" asChild>
          <Link href="/trending">Check the most hearted products here</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="!p-6">
      <div className="!my-12 !space-y-6">
        {reviews.map((review) => (
          <LatestReviewCard
            key={review?.id}
            data={review}
            userId={user.id}
            noLinker
          />
        ))}
      </div>
    </div>
  );
}
