"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  useGetMyReviewsQuery,
  useGetReviewsofMeQuery,
} from "@/redux/features/users/userApi";
import { InboxIcon, Loader2Icon } from "lucide-react";

import { useUser } from "@/context/userContext";

import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import BrandLatestReviewCard from "@/components/core/brand-rev-card-me";
import LatestReviewCard from "@/components/core/internal/rev-card-me";

export default function LatestRevs() {
  const { id, role } = useUser();
  const { data, isLoading, isError, error }: any = useGetReviewsofMeQuery();
  const reviews = data?.data;

  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <InboxIcon />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>{error?.data?.message ?? "No Reviews found"}</EmptyTitle>
        </EmptyContent>
      </Empty>
    );
  }
  if (isLoading) {
    return (
      <div className="!p-6 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (isError || !Array.isArray(reviews?.data) || reviews?.data?.length === 0) {
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
        {reviews?.data?.map((review: any) =>
          role === 5 ? (
            <LatestReviewCard key={review?.id} data={review} userId={id} />
          ) : (
            <BrandLatestReviewCard key={review?.id} data={review} userId={id} />
          )
        )}
      </div>
    </div>
  );
}
