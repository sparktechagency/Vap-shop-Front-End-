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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "@/components/core/internal/namer";
import { CardDescription } from "@/components/ui/card";

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
      <div className="!py-12 flex flex-col gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
            key={i}
          >
            <div
              className="size-16 aspect-square rounded-full bg-secondary bg-center bg-cover"
              style={{ backgroundImage: `url('/image/icon/user.jpeg')` }}
            ></div>
            <div className="font-semibold">Ryan Oswald</div>
            <div className="text-sm font-semibold text-muted-foreground">
              ryan234@email.com
            </div>
            <div className="text-sm font-semibold">Date: 23-04-2024</div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>View Notice</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="">
                  <div className="flex flex-row justify-start items-center gap-4">
                    <Avatar className="size-20">
                      <AvatarImage
                        src="/image/icon/user.jpeg"
                        className="object-cover"
                      />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="">
                      <Namer type="member" name="Jay Smith" />
                      <p className="text-xs text-muted-foreground">
                        jaysmith@email.com
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold mt-8! mb-4!">
                    Report reason:
                  </p>
                  <CardDescription className="">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Magni corrupti et, veniam perspiciatis, tenetur qui pariatur
                    magnam velit odit natus eos adipisci dolore eius! Illum vero
                    ex enim saepe? Veniam!
                  </CardDescription>
                  <DialogFooter>
                    <Button>Ban User</Button>
                    <DialogClose asChild>
                      <Button variant="link">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
