import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";
import TopStores from "./top-stores";
import TopBrands from "./top-brands";
import LatestRevs from "./latest-revs";
import Inbox from "./inbox";
import Groups from "./groups";
import { useUser } from "@/context/userContext";
import About from "./about";
import Catalog from "./catalog";
import Announcement from "./announcement";
import Post from "./post";
import Feed from "./feed";

export default function TabsTriggerer() {
  const { role } = useUser() || {};
  const isMember = parseInt(role) === 6;

  return (
    <div className="container !py-10 lg:!p-10">
      <Tabs defaultValue="top-stores">
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6">
          {isMember && (
            <>
              <TabsTrigger value="top-stores">Top 6 Stores</TabsTrigger>
              <TabsTrigger value="top-brands">Top 6 Brands</TabsTrigger>
            </>
          )}
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          {!isMember && parseInt(role) != 2 && (
            <TabsTrigger value="announcement">Announcement</TabsTrigger>
          )}
          {isMember && (
            <TabsTrigger value="reviews">Latest Reviews</TabsTrigger>
          )}
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="create-group">Create a group</TabsTrigger>
          {!isMember && (
            <>
              {parseInt(role) != 2 && (
                <TabsTrigger value="catalog">Catalog</TabsTrigger>
              )}
              <TabsTrigger value="about">About</TabsTrigger>
            </>
          )}
        </TabsList>

        {isMember && (
          <>
            <TabsContent value="top-stores">
              <TopStores />
            </TabsContent>
            <TabsContent value="top-brands">
              <TopBrands />
            </TabsContent>
            <TabsContent value="reviews">
              <LatestRevs />
            </TabsContent>
          </>
        )}

        <TabsContent value="post">
          <Post />
        </TabsContent>
        <TabsContent value="feed">
          <Feed />
        </TabsContent>
        <TabsContent value="inbox">
          <Inbox />
        </TabsContent>
        <TabsContent value="announcement">
          <Announcement />
        </TabsContent>
        <TabsContent value="create-group">
          <Groups />
        </TabsContent>
        <TabsContent value="catalog">
          <Catalog />
        </TabsContent>
        <TabsContent value="about">
          <About />
        </TabsContent>
      </Tabs>
    </div>
  );
}
