import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { Input } from "@/components/ui/input";

export default function AddLocation() {
  const my = useUser();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add a new Location</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60dvw]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Add a new location</DialogTitle>
        </DialogHeader>
        <div className="">
          <Input />
        </div>
        <Button type="button">Add</Button>
      </DialogContent>
    </Dialog>
  );
}
