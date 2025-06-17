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
export default function Page() {
  return (
    <div className="h-full w-full flex flex-col justify-start items-baseline !p-12 gap-6">
      <div className="w-full grid grid-cols-2">
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
      <h2 className="text-2xl font-bold">Most Hearted Products Ads</h2>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
          key={i}
        >
          <div
            className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
            style={{ backgroundImage: `url('/image/home/car1.png')` }}
          ></div>
          <div className="font-semibold">
            Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)
          </div>
          <div className="text-sm font-semibold">Date: 23-04-2024</div>
          <Button>Remove</Button>
        </div>
      ))}
      <h2 className="text-2xl font-bold">Most Hearted Products List</h2>
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
          key={i}
        >
          <div
            className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
            style={{ backgroundImage: `url('/image/home/car1.png')` }}
          ></div>
          <div className="font-semibold">
            Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)
          </div>
          <div className="text-sm font-semibold">Date: 23-04-2024</div>
          <Button>Remove</Button>
        </div>
      ))}
    </div>
  );
}
