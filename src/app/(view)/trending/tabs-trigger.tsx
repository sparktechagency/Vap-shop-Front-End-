'use client'

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";
import MostHearted from "./most-hearted";
import MostFollowers from "./most-followers";
import MostRated from "./most-rated";
import Featured from "./featured";
import { useParams, useSearchParams } from "next/navigation";

export default function TabsTriggerer() {
  const searchParams = useSearchParams();

  const title = searchParams.get('title');
  console.log('title', title);
  return (
    <div className="container !py-10">
      <Tabs defaultValue="hearted">
        <TabsList className="border-b !justify-center gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="hearted">Most Hearted Products ❤️</TabsTrigger>
          <TabsTrigger value="followers">Most Followers 👥</TabsTrigger>
          <TabsTrigger value="rated">Most Rated ⭐</TabsTrigger>
          <TabsTrigger value="featured">Featured 🔍</TabsTrigger>
        </TabsList>
        <TabsContent value="hearted">
          <MostHearted />
        </TabsContent>
        <TabsContent value="followers">
          <MostFollowers />
        </TabsContent>
        <TabsContent value="rated">
          <MostRated />
        </TabsContent>
        <TabsContent value="featured">
          <Featured />
        </TabsContent>
      </Tabs>
    </div>
  );
}
