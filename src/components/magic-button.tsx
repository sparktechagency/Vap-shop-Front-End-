"use client";
import { Loader2Icon, RadarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModeToggle } from "./core/mode-toggle";

export default function MagicButton() {
  const [mounted, setMouted] = useState(false);

  useEffect(() => {
    setMouted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Loader2Icon className="animate-spin" />
      </>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed bottom-6 left-6 !size-12 !p-0 text-3xl bg-gradient-to-br from-zinc-950 to- to-zinc-500 text-white hover:from-zinc-900 hover:to-zinc-600 cursor-pointer rounded-full flex justify-center items-center">
          <RadarIcon />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Magic Land</DialogTitle>
          <div className="!py-4 w-full">
            <div className="w-full !py-2 flex flex-row justify-between items-center">
              <p className="text-xs sm:text-sm">Theme changer: </p>{" "}
              <div>
                <ModeToggle />
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
