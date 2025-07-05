import ForumCard from "@/components/core/forum-card";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreGroupListQuery } from "@/redux/features/store/StoreApi";
import Link from "next/link";
import React from "react";
const data = {
  title: "New Members: Introduce Yourself!",
  new: true,
  secondaryA: "12K Threads",
  secondaryB: "225k messages",
  date: "May 28, 202",
};
const diffData = {
  title: "New Members: Introduce Yourself!",
  new: false,
  secondaryA: "12K Threads",
  secondaryB: "225k messages",
  date: "May 28, 202",
};
export default function Groups({ id }: any) {
  const { data: groupData, isLoading, isError, error } = useStoreGroupListQuery(id as any);
  console.log('groupData', groupData);
  if (isLoading) return <div className=" !my-6">{[...Array(4)].map((_, i) => (<Skeleton key={i} className="h-64 w-full rounded-lg mb-4" />))}</div>
  return (
    <div className="!mt-12">
      <Card className="gap-0 !pt-0 overflow-hidden">
        <CardHeader className="flex justify-between items-center bg-secondary !p-6">
          <div></div>
          <Select>
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Filter" className="bg-background" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="light">Most Recent</SelectItem>
              <SelectItem value="dark">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        {groupData ? groupData?.data?.data.map((item: any, index: number) => (
          <ForumCard
            key={index}
            data={
              {
                id: item.id,
                title: item.title,
                description: item.description,
                user_id: item.user_id,
                created_at: item.created_at,
                updated_at: item.updated_at,
                threads_count: item.total_threads,
                total_threads: item.total_threads,
                total_comments: item.total_comments,
              }
            }
            diffData={diffData}
          />
        )) : (
          <div>
            <h1 className="text-2xl font-semibold">No Groups</h1>
          </div>
        )
        }

      </Card>
    </div>
  );
}
