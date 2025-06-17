import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";

export default function TabsTriggerer() {
  return (
    <div className="container !py-10 lg:!p-10">
      <Tabs defaultValue="top-stores">
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="top-stores">Top 6 Stores</TabsTrigger>
          <TabsTrigger value="top-brands">Top 6 Brands</TabsTrigger>
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="reviews">Latest Reviews</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="create-group">Create a group</TabsTrigger>
        </TabsList>
        <TabsContent value="top-stores"></TabsContent>
      </Tabs>
    </div>
  );
}
