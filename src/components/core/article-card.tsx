import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Share2Icon } from "lucide-react";

export default function ArticleCard() {
  return (
    <Card className="!pt-0  overflow-hidden">
      <Image
        src="/image/trends.jpg"
        height={1920}
        width={1280}
        alt="article"
        className="aspect-video object-cover hover:scale-105 hover:opacity-80 transition-all"
      />
      <CardHeader>
        <CardTitle>The Ultimate Beginner&apos;s Guide to Vaping</CardTitle>
        <CardDescription className="line-clamp-4">
          Stepping into the vape world can feel overwhelming with all the
          devices, flavors, and nicotine options out there. This guide breaks
          everything down into easy steps—perfect for anyone new to vaping.
          We’ll cover the basics of how vapes work, how to choose your first
          setup, what e-liquids are best for beginners, and tips to avoid common
          mistakes. Whether you&apos;re switching from smoking or just curious
          about vaping, this one’s your go-to manual...
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        <button className="w-full !py-4 rounded-lg outline-2 flex justify-center items-center cursor-pointer hover:bg-secondary transition-colors text-xs md:text-base">
          Review Article
        </button>
        <button className="w-full text-xs md:text-base !py-4 rounded-lg outline-0 dark:outline-2 flex justify-center items-center bg-foreground text-background dark:text-foreground dark:bg-secondary cursor-pointer dark:hover:!bg-card">
          <Share2Icon className="size-3 md:size-5 !mr-1 md:!mr-2" /> Share
        </button>
      </CardContent>
    </Card>
  );
}
