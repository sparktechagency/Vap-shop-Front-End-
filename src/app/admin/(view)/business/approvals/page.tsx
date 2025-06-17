import Namer from "@/components/core/internal/namer";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Page() {
  return (
    <div className="h-full w-full flex flex-col justify-start items-baseline !p-12 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
          key={i}
        >
          <div
            className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
            style={{ backgroundImage: `url('/image/home/car1.png')` }}
          ></div>
          <div className="flex gap-2">
            <Namer name="SMOK" isVerified type="brand" /> request for Ad
            approval
          </div>
          <div className="text-sm font-semibold">Date: 23-04-2024</div>
          <Button>View Ad Request</Button>
        </div>
      ))}
    </div>
  );
}
