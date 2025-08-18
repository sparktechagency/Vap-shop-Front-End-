/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import Inbox from "./inbox";
import About from "./about";
import Groups from "./groups";
import Post from "../../stores/store/post";

export default function TabsTriggerer({ id }: any) {
  return (
    <div className="!py-10">
      <Tabs defaultValue="hearted">
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="hearted">Most Hearted Products</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          {/* <TabsTrigger value="announcement">Announcement</TabsTrigger> */}
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          {/* <TabsTrigger value="inbox">Inbox</TabsTrigger> */}
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="hearted">
          <MostHearted id={id} />
        </TabsContent>
        <TabsContent value="catalog">
          <Catalog id={id} />
        </TabsContent>
        <TabsContent value="announcement">
          <Post id={id} />
        </TabsContent>
        <TabsContent value="feed">
          <Announcement id={id} />
        </TabsContent>
        {/* <TabsContent value="inbox">
          <Inbox />
        </TabsContent> */}
        <TabsContent value="about">
          <About id={id} />
        </TabsContent>
        <TabsContent value="groups">
          <Groups id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
