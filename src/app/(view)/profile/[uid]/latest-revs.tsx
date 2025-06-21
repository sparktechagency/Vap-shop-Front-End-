import ReviewCard from "@/components/core/review-card";
import React from "react";

export default function LatestRevs() {
  return (
    <div className="!p-6">
      <div className="!my-12 !space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ReviewCard key={i} />
        ))}
      </div>
    </div>
  );
}
