import ForumCard from "@/components/core/forum-card";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
export default function Groups() {
  return (
    <div className="!mt-12">
      <Card className="gap-0 !pt-0 overflow-hidden">
        <CardHeader className="flex justify-between items-center bg-secondary !p-6">
          <Link
            href="/forum/thread"
            className="text-sm underline hover:text-secondary-foreground/80"
          >
            Create a group
          </Link>
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
        <ForumCard data={data} to="/forum/thread" />
        <ForumCard data={diffData} to="/forum/thread" />
        <ForumCard data={data} to="/forum/thread" />
        <ForumCard data={data} to="/forum/thread" />
        <ForumCard data={diffData} to="/forum/thread" />
        <ForumCard data={data} to="/forum/thread" />
        <ForumCard data={data} to="/forum/thread" />
        <ForumCard data={data} to="/forum/thread" />
        <ForumCard data={diffData} to="/forum/thread" />
        <ForumCard data={data} to="/forum/thread" />
      </Card>
    </div>
  );
}
