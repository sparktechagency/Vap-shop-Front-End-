import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-6 !py-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className="rounded-lg border !p-4 flex flex-row justify-between items-center md:!pr-8"
          key={i}
        >
          <div className="flex gap-2 items-center">
            <Avatar className="size-14">
              <AvatarImage
                src="/image/icon/user.jpeg"
                className="object-cover"
              />
              <AvatarFallback>UB</AvatarFallback>
            </Avatar>
            <Namer name="Unga Bunga" type="member" isVerified={false} />{" "}
            <span>followed you</span>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">12:34 pm, today</p>
          </div>
        </div>
      ))}
    </div>
  );
}
