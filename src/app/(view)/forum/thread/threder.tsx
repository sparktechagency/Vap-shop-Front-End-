import ForumCard from "@/components/core/forum-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PaintbrushIcon } from "lucide-react";
import React from "react";
const data = {
  title: "Hello ! Im Raven",
  new: true,
  secondaryA: "Replies: 28",
  secondaryB: "Views: 20k",
  date: "May 28, 202",
};
const diffData = {
  title: "Hello ! Im Raven",
  new: false,
  secondaryA: "Replies: 28",
  secondaryB: "Views: 20k",
  date: "May 28, 202",
};
export default function Threader() {
  return (
    <div className="!space-y-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PaintbrushIcon /> Post a thread
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle></DialogTitle>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="gap-0 !pt-0">
        <CardHeader className="flex justify-end items-center bg-secondary !p-6">
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
        <ForumCard data={data} to="/forum/thread/post" />
        <ForumCard data={diffData} to="/forum/thread/post" />
        <ForumCard data={data} to="/forum/thread/post" />
        <ForumCard data={data} to="/forum/thread/post" />
        <ForumCard data={diffData} to="/forum/thread/post" />
        <ForumCard data={data} to="/forum/thread/post" />
        <ForumCard data={data} to="/forum/thread/post" />
        <ForumCard data={data} to="/forum/thread/post" />
        <ForumCard data={diffData} to="/forum/thread/post" />
        <ForumCard data={data} to="/forum/thread/post" />
      </Card>
    </div>
  );
}
