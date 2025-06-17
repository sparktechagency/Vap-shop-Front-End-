import FeedCard from "@/components/core/feed-card";

import React from "react";

export default function Announcement() {
  const mockData = {
    name: "SMOK",
    avatar: "/image/icon/brand.jpg",
  };
  return (
    <div className="!my-12 !space-y-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FeedCard data={mockData} key={i} />
      ))}
    </div>
  );
}
