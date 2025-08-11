/* eslint-disable @typescript-eslint/no-explicit-any */
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

// types/forum.ts
export interface ForumGroup {
  id: number;
  title: string;
  description: string;
  type: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  threads_count: number;
  total_threads: number;
  total_comments: number;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ForumApiResponse {
  ok: boolean;
  message: string;
  data: {
    current_page: number;
    data: ForumGroup[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
export default function TabsTriggererForum() {
  const [activeTab, setActiveTab] = useState("default");

  const queryParams = () => {
    switch (activeTab) {
      case "trending":
        return { show_front: 1, is_trending: 1 };
      case "latest":
        return { show_front: 1, is_latest: 1 };
      default:
        return { show_front: 1 };
    }
  };

  const { data, isLoading, isError, error, refetch } = useGetForumQuery(
    queryParams()
  );

  if (isLoading) return <LoadingScletion />;

  // Type guard to check if data is ForumApiResponse
  const isApiResponse = (res: any): res is ForumApiResponse => {
    return res?.data?.data !== undefined && Array.isArray(res.data.data);
  };

  if (isError || !data || !isApiResponse(data)) {
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
      <Tabs
        defaultValue="default"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="border-b !justify-center gap-2 md:gap-3 lg:gap-6">
          <TabsTrigger value="default">💬 Vape Talk Central</TabsTrigger>
          <TabsTrigger value="trending">🔥 Trending Now</TabsTrigger>
          <TabsTrigger value="latest">✨ Fresh Puffs</TabsTrigger>
        </TabsList>

        <TabsContent value="default">
          <VapeTalk refetch={refetch} forumGroups={data.data.data} />
        </TabsContent>

        <TabsContent value="trending">
          <VapeTalk refetch={refetch} forumGroups={data.data.data} />
        </TabsContent>

        <TabsContent value="latest">
          <VapeTalk refetch={refetch} forumGroups={data.data.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}