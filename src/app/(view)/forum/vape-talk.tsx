import ForumCard from "@/components/core/forum-card";
import { Card } from "@/components/ui/card";

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
export default function VapeTalk() {
  return (
    <div className="!py-12">
      <Card className="gap-0">
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
