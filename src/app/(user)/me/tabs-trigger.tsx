"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import About from "./about";
import Catalog from "./catalog";
import Announcement from "./announcement";
import Post from "./post";
import Feed from "./feed";
import { useUser } from "@/context/userContext";

const tabComponents: Record<string, React.ReactNode> = {
  "top-stores": <TopStores />,
  "top-brands": <TopBrands />,
  reviews: <LatestRevs />,
  post: <Post />,
  feed: <Feed />,
  inbox: <Inbox />,
  "create-group": <Groups />,
  announcement: <Announcement />,
  catalog: <Catalog />,
  about: <About />,
};

export default function TabsTriggerer() {
  const my = useUser() || {};
  const role = parseInt(my.role);
  const isMember = role === 6;
  const isAdmin = String(role) === "1";

  const allTabs = [
    { value: "top-stores", label: "Top 6 Stores", visible: isMember },
    { value: "top-brands", label: "Top 6 Brands", visible: isMember },
    {
      value: "catalog",
      label:
        role === 3
          ? "Catalogue"
          : role === 5
          ? "Store"
          : role === 4
          ? "Wholesale"
          : "Catalogue",
      visible: !isMember && role !== 2,
    },
    { value: "post", label: "Post", visible: true },
    { value: "feed", label: "Feed", visible: true },
    { value: "reviews", label: "Latest Reviews", visible: isMember },

    { value: "create-group", label: "Groups", visible: true },
    {
      value: "about",
      label: "About",
      visible: !isMember && !isAdmin,
    },
    { value: "inbox", label: "Inbox", visible: true },
  ];
  function getDefaultTab(role: number): string {
    if (role === 6) return "top-stores";
    return "post"; // fallback/default for other users
  }
  return (
    <div className="container !py-10 lg:!p-10">
      <Tabs defaultValue={getDefaultTab(parseInt(my.role))}>
        <TabsList className="border-b !justify-start gap-2 md:gap-3 lg:gap-6">
          {allTabs
            .filter((tab) => tab.visible)
            .map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
        </TabsList>

        {allTabs
          .filter((tab) => tab.visible)
          .map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {React.cloneElement(tabComponents[tab.value] as any, { my })}
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
}
