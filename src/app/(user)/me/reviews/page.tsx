import ReviewCard from "@/components/core/review-card";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function Page() {
  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Reviews</h1>
      <Separator />
      <div className="!my-12 !space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ReviewCard key={i} />
        ))}
      </div>
    </div>
  );
}
