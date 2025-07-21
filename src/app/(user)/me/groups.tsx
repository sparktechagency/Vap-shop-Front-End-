/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ForumCard from "@/components/core/forum-card";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/userContext";
import { useGetDashboardForumQuery } from "@/redux/features/Forum/ForumApi";
import Link from "next/link";
import React from "react";
export default function Groups() {
  const my = useUser();

  const { data, isLoading } = useGetDashboardForumQuery({ id: my.id });

  if (!isLoading) {
    console.log(data);
  }
  return (
    <div className="!p-6">
      <Card className="gap-0 !pt-0 ">
        <CardHeader className="flex justify-between items-center bg-secondary !p-6 rounded-xl">
          <Link
            href="/forum/create"
            className="text-sm underline hover:text-secondary-foreground/80"
          >
            Create a group
          </Link>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" className="bg-background" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="light">Most Recent</SelectItem>
              <SelectItem value="dark">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        {!data ? (
          <p className="mt-6! flex justify-center items-center text-muted-foreground text-sm">
            No Forum Found
          </p>
        ) : (
          data?.data?.data.map((x: any) => (
            <ForumCard
              key={x.id}
              data={x}
              to={`/forum/thread/${x.id}`}
              editable
            />
          ))
        )}
      </Card>
    </div>
  );
}
