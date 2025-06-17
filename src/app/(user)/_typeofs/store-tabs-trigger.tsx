import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LatestRevs from "./items/latest-revs";
import Inbox from "./items/inbox";
import Groups from "../me/groups";
import Catalog from "@/app/(view)/brands/brand/catalog";

export default function StoreTabsTriggerer() {
  return (
    <div className="container !py-10 lg:!p-10">
      <Tabs defaultValue="post">
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6 flex">
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <LatestRevs />
        </TabsContent>
        <TabsContent value="feed">
          <LatestRevs />
        </TabsContent>
        <TabsContent value="inbox">
          <Inbox />
        </TabsContent>
        <TabsContent value="groups">
          <Groups />
        </TabsContent>
        <TabsContent value="catalog">
          <Catalog />
        </TabsContent>
        <TabsContent value="about" className="!space-y-4 !pt-12">
          <h1 className="text-3xl font-semibold">About SMOK</h1>
          <Textarea className="h-[200px]" placeholder="Type here.."></Textarea>
          <Button>Update</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
