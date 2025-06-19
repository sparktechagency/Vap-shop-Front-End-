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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <h2 className="text-2xl font-bold">Most Followers Ads</h2>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
          key={i}
        >
          <Avatar>
            <AvatarImage />
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>
          <div className="font-semibold"></div>
          <Button>Remove</Button>
        </div>
      ))}
      {/* <h2 className="text-2xl font-bold">Most Followers Products List</h2>
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
          key={i}
        >
          <div
            className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
            style={{ backgroundImage: `url('/image/home/car1.png')` }}
          ></div>
          <div className="font-semibold">Vodoo Shop</div>
          <div className="text-sm font-semibold">Followers: 45k</div>
          <Button variant="special">View Shop</Button>
        </div>
      ))} */}
    </div>
  );
}
