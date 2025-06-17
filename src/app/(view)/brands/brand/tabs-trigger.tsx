import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";
import MostHearted from "./most-hearted";
import Catalog from "./catalog";
import Announcement from "./announcement";
import Inbox from "./inbox";
import About from "./about";
import Groups from "./groups";

export default function TabsTriggerer() {
  return (
    <div className="!py-10">
      <Tabs defaultValue="hearted">
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="hearted">Most Hearted Products</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="announcement">Announcement</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="hearted">
          <MostHearted />
        </TabsContent>
        <TabsContent value="catalog">
          <Catalog />
        </TabsContent>
        <TabsContent value="announcement">
          <Announcement />
        </TabsContent>
        <TabsContent value="feed">
          <Announcement />
        </TabsContent>
        <TabsContent value="inbox">
          <Inbox />
        </TabsContent>
        <TabsContent value="about">
          <About />
        </TabsContent>
        <TabsContent value="groups">
          <Groups />
        </TabsContent>
      </Tabs>
    </div>
  );
}
