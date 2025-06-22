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
import { useGetBrandGroupQuery } from "@/redux/features/brand/brandApis";
import { useGetallThredsByGropIdQuery } from "@/redux/features/Forum/ForumApi";
import Link from "next/link";
import React from "react";


export default function Groups({ id }: any) {

  const { data: groupData, isLoading, isError, error } = useGetBrandGroupQuery(id as any);
  console.log('groupData', groupData);

  if (isLoading) {
    return <div className=" !my-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-lg mb-4" />
      ))}
    </div>
  }


  if (isError) {
    console.log('error', error);
  }

  return (
    <div className="!mt-12">
      <Card className="gap-0 !pt-0 overflow-hidden">
        <CardHeader className="flex justify-end items-center bg-secondary !p-6">

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
        {groupData.data?.data.map((group: any) => (
          <ForumCard key={group.id} data={group} />
        ))}

      </Card>
    </div>
  );
}
