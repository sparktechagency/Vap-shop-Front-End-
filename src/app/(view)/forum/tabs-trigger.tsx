import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";
import VapeTalk from "./vape-talk";

export default function TabsTriggererForum() {
  return (
    <div className="container !py-10">
      <Tabs defaultValue="hearted">
        <TabsList className="border-b !justify-center gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="hearted"> 💬 Vape Talk Central</TabsTrigger>
          <TabsTrigger value="followers">🔥 Trending Now</TabsTrigger>
          <TabsTrigger value="rated">✨ Fresh Puffs</TabsTrigger>
          <TabsTrigger value="featured">🫂 Create Community</TabsTrigger>
        </TabsList>
        <TabsContent value="hearted">
          <VapeTalk />
        </TabsContent>
        <TabsContent value="followers">
          <VapeTalk />
        </TabsContent>
        <TabsContent value="rated">
          <VapeTalk />
        </TabsContent>
        <TabsContent value="featured">
          <VapeTalk />
        </TabsContent>
      </Tabs>
    </div>
  );
}
