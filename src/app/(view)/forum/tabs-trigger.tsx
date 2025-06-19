/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/custom-tabs";
import VapeTalk from "./vape-talk";
import { useGetForumQuery } from "@/redux/features/Forum/ForumApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { ExclamationTriangleIcon, ReloadIcon } from "lucide-react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingScletion from "@/components/LoadingScletion";

export default function TabsTriggererForum() {
  const { data, isLoading, isError, error, refetch } = useGetForumQuery();

  if (isLoading) {
    return <LoadingScletion />;
  }

  if (isError) {
    return (
      <div className="container !py-10">
        <div className="mb-8">
          <Tabs defaultValue="hearted">
            <TabsList className="border-b !justify-center gap-2 md:gap-3 lg:gap-6">
              <TabsTrigger value="hearted">💬 Vape Talk Central</TabsTrigger>
              <TabsTrigger value="followers">🔥 Trending Now</TabsTrigger>
              <TabsTrigger value="rated">✨ Fresh Puffs</TabsTrigger>
              <TabsTrigger value="featured">🫂 Create Community</TabsTrigger>
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
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container !py-10">
      <Tabs defaultValue="hearted">
        <TabsList className="border-b !justify-center gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="hearted">💬 Vape Talk Central</TabsTrigger>
          <TabsTrigger value="followers">🔥 Trending Now</TabsTrigger>
          <TabsTrigger value="rated">✨ Fresh Puffs</TabsTrigger>
          <TabsTrigger value="featured">🫂 Create Community</TabsTrigger>
        </TabsList>
        <TabsContent value="hearted">
          <VapeTalk forumGroups={data?.data?.data} />
        </TabsContent>
        <TabsContent value="followers">
          <VapeTalk forumGroups={data?.data?.data} />
        </TabsContent>
        <TabsContent value="rated">
          <VapeTalk forumGroups={data?.data?.data} />
        </TabsContent>
        <TabsContent value="featured">
          <VapeTalk forumGroups={data?.data?.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
