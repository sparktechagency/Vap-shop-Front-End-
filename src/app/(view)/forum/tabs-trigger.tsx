"use client";

import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";
import VapeTalk from "./vape-talk";
import { useGetForumQuery } from "@/redux/features/Forum/ForumApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingScletion from "@/components/LoadingScletion";

export default function TabsTriggererForum() {
  const [activeTab, setActiveTab] = useState("default");

  // Query params based on tab
  const queryParams = () => {
    switch (activeTab) {
      case "trending":
        return { show_front: 1, is_trending: 1 };
      case "latest": // Fresh Puffs
        return { show_front: 1, is_latest: 1 };
      default:
        return { show_front: 1 };
    }
  };

  const { data, isLoading, isError, error, refetch } = useGetForumQuery(queryParams());

  if (isLoading) return <LoadingScletion />;

  if (isError) {
    return (
      <div className="container !py-10">
        <div className="mb-8">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-b !justify-center gap-2 md:gap-3 lg:gap-6">
              <TabsTrigger value="default">💬 Vape Talk Central</TabsTrigger>
              <TabsTrigger value="trending">🔥 Trending Now</TabsTrigger>
              <TabsTrigger value="latest">✨ Fresh Puffs</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading forum data</AlertTitle>
          <AlertDescription>
            {(error as any)?.data?.message ||
              (error as any)?.error ||
              "Failed to load forum discussions. Please try again."}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => refetch()}
          >
            <RefreshCw className="mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container !py-10">
      <Tabs defaultValue="default" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b !justify-center gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="default">💬 Vape Talk Central</TabsTrigger>
          <TabsTrigger value="trending">🔥 Trending Now</TabsTrigger>
          <TabsTrigger value="latest">✨ Fresh Puffs</TabsTrigger>
        </TabsList>

        <TabsContent value="default">
          <VapeTalk forumGroups={data?.data?.data} />
        </TabsContent>
        <TabsContent value="trending">
          <VapeTalk forumGroups={data?.data?.data} />
        </TabsContent>
        <TabsContent value="latest">
          <VapeTalk forumGroups={data?.data?.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
