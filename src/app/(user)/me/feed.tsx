import FeedCard from "@/components/core/feed-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Feed() {
  return (
    <div className="!p-6">
      <div className="!my-12 !space-y-6">
        <div className="flex justify-end items-center">
          <Button asChild>
            <Link href="/me/create-feed">Post a new feed</Link>
          </Button>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <FeedCard
            key={i}
            data={{
              name: "Shop name",
              avatar: "/image/icon/user.jpeg",
            }}
          />
        ))}
      </div>
    </div>
  );
}
