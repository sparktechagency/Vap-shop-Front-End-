import ReplyCard from "@/components/core/reply-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function Page() {
  return (
    <main className="py-12! px-4! lg:px-[7%]!">
      <h1 className="text-4xl font-bold mb-12!">
        The Ultimate Beginner&apos;s Guide to Vaping
      </h1>
      <div className="flex flex-row justify-between items-center">
        <p className="text-muted-foreground text-sm mb-6!">Posted by: Raven</p>
        <p className="text-muted-foreground text-sm mb-6!">
          Date posted: 06-06-2026
        </p>
      </div>
      <article>
        Stepping into the vape world can feel overwhelming with all the devices,
        flavors, and nicotine options out there. This guide breaks everything
        down into easy steps—perfect for anyone new to vaping. We’ll cover the
        basics of how vapes work, how to Stepping into the vape world can feel
        overwhelming with all the devices, flavors, and nicotine options out
        there. This guide breaks everything down into easy steps—perfect for
        anyone new to vaping. We’ll cover the basics of how vapes work, how to
        Stepping into the vape world can feel overwhelming with all the devices,
        flavors, and nicotine options out there. This guide breaks everything
        down into easy steps—perfect for anyone new to vaping. We’ll cover the
        basics of how vapes work, how to Stepping into the vape world can feel
        overwhelming with all the devices, flavors, and nicotine options out
        there. This guide breaks everything down into easy steps—perfect for
        anyone new to vaping. We’ll cover the basics of how vapes work, how to
      </article>
      <Separator className="my-12!" />
      <div className="flex flex-row justify-between items-center gap-6">
        <Input />
        <Button>Post comment</Button>
      </div>
      <div className="space-y-6! mt-12!">
        <ReplyCard />
      </div>
    </main>
  );
}
