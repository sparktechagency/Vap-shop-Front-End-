import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function Page() {
  return (
    <div className="md:!px-[7%] !px-4 !py-12 h-screen">
      <div className="w-full h-full grid grid-cols-7 gap-6">
        <div className="h-full col-span-2 border rounded-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="flex flex-row justify-start items-center gap-6 !px-6 !py-3 border-b"
              key={i}
            >
              <Avatar className="!size-12">
                <AvatarImage src="/image/icon/user.jpeg" />
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
              <div className="">
                <Namer name="NugNug" size="sm" type="brand" />
                <p className="text-sm text-purple-500 font-bold">
                  Sent a message
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="h-full col-span-5 border rounded-lg flex flex-col justify-between items-start">
          <div className="flex flex-row justify-start items-center gap-3 !px-4 !py-3 border-b w-full">
            <Avatar className="!size-12">
              <AvatarImage src="/image/icon/user.jpeg" />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <div className="w-full">
              <Namer name="NugNug" size="sm" type="brand" />

              <div
                className="w-full text-sm text-green-500 font-bold flex flex-row items-center gap-2"
                suppressHydrationWarning
              >
                <div className="size-3 rounded-full  bg-green-500" /> online
              </div>
            </div>
          </div>
          <div className=""></div>
          <div className="flex flex-row justify-between w-full !p-6 gap-6">
            <Input />
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
