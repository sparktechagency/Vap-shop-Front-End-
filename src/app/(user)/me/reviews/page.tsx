"use client";

import React from "react";
import Link from "next/link";
// import ReviewCard from "@/components/core/review-card";
import { Button } from "@/components/ui/button";
import {
  useGetMyReviewsQuery,
  useGetReviewsofMeQuery,
} from "@/redux/features/users/userApi";
import { Loader2Icon } from "lucide-react";

import { useUser } from "@/context/userContext";
import LatestReviewCard from "@/components/core/internal/rev-card-me";

export default function LatestRevs() {
  const { id } = useUser();
  const { data, isLoading, isError, error } = useGetReviewsofMeQuery();
  const reviews = data?.data;

  if (isError) {
    return (
      <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
        <code className="whitespace-pre-wrap">
          {JSON.stringify(error, null, 2)}
        </code>
      </pre>
    );
  }
  if (isLoading) {
    return (
      <div className="!p-6 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (isError || !Array.isArray(reviews?.data) || reviews?.data.length === 0) {
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
        {reviews?.data?.map((review: any) => (
          <LatestReviewCard key={review?.id} data={review} userId={id} />
        ))}
      </div>
    </div>
  );
}
