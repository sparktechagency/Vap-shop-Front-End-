/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";
// import MostHearted from "./most-hearted";
import Catalog from "./catalog";
// import Inbox from "./inbox";
import About from "./about";
import Groups from "./groups";
import Feed from "./feed";
import Post from "./post";
import Gallery from "./gallery";
// import Inbox from "./inbox";

export default function TabsTriggerer({ id }: any) {
  return (
    <div className="!py-10">
      <Tabs defaultValue="catalog">
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6">
          {/* <TabsTrigger value="hearted">Most Hearted Products</TabsTrigger> */}
          <TabsTrigger value="catalog">Store</TabsTrigger>
          {/* <TabsTrigger value="announcement">Announcement</TabsTrigger> */}
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          {/* <TabsTrigger value="groups">Groups</TabsTrigger> */}
          {/* <TabsTrigger value="inbox">Inbox</TabsTrigger> */}
        </TabsList>

        {/* <TabsContent value="hearted">
          <MostHearted />
        </TabsContent> */}
        <TabsContent value="catalog">
          <Catalog id={id} />
        </TabsContent>
        <TabsContent value="feed">
          <Feed id={id} />
        </TabsContent>
        <TabsContent value="feed">
          <Gallery id={id} />
        </TabsContent>
        <TabsContent value="post">
          <Post id={id} />
        </TabsContent>
        <TabsContent value="about">
          <About id={id} />
        </TabsContent>
        <TabsContent value="groups">
          <Groups id={id} />
        </TabsContent>
        {/* <TabsContent value="inbox">
          <Inbox storeId={id} />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
