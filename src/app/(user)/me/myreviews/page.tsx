"use client";

import React from "react";
import Link from "next/link";
// import ReviewCard from "@/components/core/review-card";
import { Button } from "@/components/ui/button";
import { useGetMyReviewsQuery } from "@/redux/features/users/userApi";
import { Loader2Icon } from "lucide-react";
import LatestReviewCard from "@/components/core/latest-review-card";
import { useUser } from "@/context/userContext";

export default function LatestRevs() {
  const { id } = useUser();
  const { data, isLoading, isError, refetch } = useGetMyReviewsQuery({
    id,
  });
  const reviews = data?.data;

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
    <div className="p-6">
      <h2 className="text-3xl border-b pb-4 mb-12">My Reviews</h2>
      <div className="!space-y-6">
        {reviews.map((review) => (
          <LatestReviewCard key={review?.id} data={review} userId={id} />
        ))}
      </div>
    </div>
  );
}
