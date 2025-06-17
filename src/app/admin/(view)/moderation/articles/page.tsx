import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";
export default function Page() {
  return (
    <div className="h-full w-full !p-6">
      <div className="grid grid-cols-2 w-full">
        <div className="flex gap-4">
          <Input placeholder="Search here" />
          <Button>Search</Button>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Name</SelectItem>
              <SelectItem value="dark">ID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 !py-12 gap-6">
        {Array.from({ length: 16 }).map((_, i) => (
          <Card className="!pt-0  overflow-hidden" key={i}>
            <Image
              src="/image/trends.jpg"
              height={1920}
              width={1280}
              alt="article"
              className="aspect-video object-cover hover:scale-105 hover:opacity-80 transition-all"
            />
            <CardHeader>
              <CardTitle>
                The Ultimate Beginner&apos;s Guide to Vaping
              </CardTitle>
              <CardDescription className="line-clamp-4">
                Stepping into the vape world can feel overwhelming with all the
                devices, flavors, and nicotine options out there. This guide
                breaks everything down into easy steps—perfect for anyone new to
                vaping. We’ll cover the basics of how vapes work, how to choose
                your first setup, what e-liquids are best for beginners, and
                tips to avoid common mistakes. Whether you&apos;re switching
                from smoking or just curious about vaping, this one’s your go-to
                manual...
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <button className="w-full !py-4 rounded-lg outline-2 flex justify-center items-center cursor-pointer hover:bg-secondary transition-colors">
                Review Article
              </button>
              <button className=" bg-destructive w-full !py-4 rounded-lg outline-0 dark:outline-2 flex justify-center items-center text-background dark:text-foreground dark:bg-secondary cursor-pointer  dark:hover:!bg-card">
                <Trash2Icon className="!mr-2" /> Delete
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
