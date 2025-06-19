import Namer from "@/components/core/internal/namer";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>View Ad Request</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Smok requested for ad approval</DialogTitle>
              </DialogHeader>
              <div className="space-y-3! flex flex-col justify-center items-center">
                <Image
                  height={300}
                  width={300}
                  src="/image/shop/item.jpg"
                  className="size-24 object-cover"
                  alt="prod"
                />
                <h4>Kiwi vape MOD</h4>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Accusantium eveniet exercitationem, officiis ex natus non
                  itaque facere, eius ipsa excepturi vero magni. Architecto
                  dolor debitis illo quas repellendus unde nulla?
                </CardDescription>
                <Button variant="special" className="w-full">
                  Approve Ad
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
