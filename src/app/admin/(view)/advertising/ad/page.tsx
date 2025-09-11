import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="border rounded-xl !p-6 h-full w-full flex justify-center items-center">
      <div className="w-1/2 border !p-6 !space-y-6">
        <h2 className="text-2xl text-center font-semibold">
          Approve Trending Ads
        </h2>

        <Button asChild className="w-full" variant="special">
          <Link href="ad/most-hearted">Most Hearted Products ❤️</Link>
        </Button>

        <Button asChild className="w-full" variant="special">
          <Link href="ad/most-followers">Most Followers 👥</Link>
        </Button>
        {/* 
        <Button asChild className="w-full" variant="special">
          <Link href="ad/most-rated">Most Rated ☁️</Link>
        </Button> */}

        <Button asChild className="w-full" variant="special">
          <Link href="ad/featured">Featured 📰</Link>
        </Button>
      </div>
    </div>
  );
}
