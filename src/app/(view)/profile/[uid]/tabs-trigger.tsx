"use client";
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
import { useParams } from "next/navigation";
import { useGetProfileQuery } from "@/redux/features/AuthApi";
import Post from "./post";
import Catalog from "./catalog";
import About from "./about";
import Feed from "./feed";

export default function TabsTriggerer() {
  const id = useParams().uid;

  const { data: user, isLoading } = useGetProfileQuery({ id });
  if (!isLoading) {
    console.log(user);
  }

  return (
    <div className="!py-10 lg:!p-10">
      <Tabs defaultValue="top-stores">
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6">
          {!isLoading && user?.data?.role !== 2 && user?.data?.role !== 4 && (
            <>
              <TabsTrigger value="top-stores">Top 6 Stores</TabsTrigger>
              <TabsTrigger value="top-brands">Top 6 Brands</TabsTrigger>
            </>
          )}
          {user?.data?.role === 4 && (
            <TabsTrigger value="wholesale">Wholesale</TabsTrigger>
          )}
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="reviews">Latest Reviews</TabsTrigger>
          {/* <TabsTrigger value="inbox">Inbox</TabsTrigger> */}
          <TabsTrigger value="create-group">Group</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        {!isLoading ? (
          <>
            <TabsContent value="top-stores">
              <TopStores user={user.data} />
            </TabsContent>
            <TabsContent value="top-brands">
              <TopBrands user={user.data} />
            </TabsContent>
            <TabsContent value="wholesale">
              <Catalog />
            </TabsContent>
            <TabsContent value="post">
              <Post user={user.data} />
            </TabsContent>
            <TabsContent value="feed">
              <Feed my={user.data} />
            </TabsContent>
            <TabsContent value="reviews">
              <LatestRevs user={user.data} />
            </TabsContent>
            <TabsContent value="inbox">
              <Inbox />
            </TabsContent>
            <TabsContent value="create-group">
              <Groups user={user.data} />
            </TabsContent>
            <TabsContent value="about">
              <About id={user.data.id} />
            </TabsContent>
          </>
        ) : (
          ""
        )}
      </Tabs>
    </div>
  );
}
