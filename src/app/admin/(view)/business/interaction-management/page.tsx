"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/custom-tabs";
import React from "react";
import Followers from "./followers";
import Hearts from "./hearts";
import Upvote from "./upvote";

export default function Page() {
  return (
    <Tabs defaultValue="followers">
      <TabsList>
        <TabsTrigger value="followers">Follower Management</TabsTrigger>
        <TabsTrigger value="hearts">Heart Management</TabsTrigger>
        <TabsTrigger value="upvotes">Upvote Management</TabsTrigger>
      </TabsList>

      <TabsContent value="followers">
        <Followers />
      </TabsContent>

      <TabsContent value="hearts">
        <Hearts />
      </TabsContent>

      <TabsContent value="upvotes">
        <Upvote />
      </TabsContent>
    </Tabs>
  );
}
