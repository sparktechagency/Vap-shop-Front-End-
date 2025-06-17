"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon, UploadIcon } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <main className="flex-1 w-full bg-zinc-900 rounded-xl !p-6">
      <h1 className="text-2xl text-center font-semibold !pb-6">
        Choose slider
      </h1>
      <div className="w-full grid grid-cols-6 gap-6">
        <label
          htmlFor="imgup"
          className="cursor-pointer aspect-square text-muted-foreground w-full bg-inherit rounded-lg border-2 border-dashed flex flex-col justify-center items-center hover:bg-muted transition"
        >
          <UploadIcon className="mb-2" />
          <p className="text-sm text-center">Select image to upload</p>
          <p className="text-xs text-zinc-600 text-center">
            Only png, jpeg, webp are supported <br /> (Max file size 3MB)
          </p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            id="imgup"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("Selected file:", file);
                // You can add validation logic here
              }
            }}
          />
        </label>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="relative group aspect-square w-full rounded-lg bg-center bg-cover"
            style={{ backgroundImage: "url('/image/home/car3.png')" }}
          >
            <div className="hidden group-hover:flex absolute z-50 h-full w-full left-0 top-0 justify-center items-center hover:bg-background/70 rounded-lg">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="" size="icon" variant="ghost">
                    <TrashIcon className="text-destructive" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="">Confirm Delete</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this image?
                    </DialogDescription>
                    <DialogFooter>
                      <Button variant="destructive">Delete</Button>
                      <DialogClose asChild>
                        <Button>Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
