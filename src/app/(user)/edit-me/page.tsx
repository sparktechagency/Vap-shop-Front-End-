import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenBoxIcon } from "lucide-react";
import React from "react";
import DropOff from "../../../components/core/drop-off";
import EditForm from "./edit-form";

export default function Page() {
  return (
    <div className="!p-12">
      <div className="">
        <div className="size-[200px] relative">
          <Avatar className="h-full w-full">
            <AvatarImage src="/image/icon/user.jpeg" className="object-cover" />
            <AvatarFallback />
          </Avatar>

          <Dialog>
            <DialogTrigger asChild>
              <div className="size-8 rounded-full absolute right-[7%] bottom-[7%] border bg-background flex justify-center items-center cursor-pointer">
                <PenBoxIcon className="size-4" />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Profile picture</DialogTitle>
              </DialogHeader>
              <div className="">
                <DropOff />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="!py-12">
          <h1 className="text-3xl font-semibold !pb-2">Edit Profile</h1>
          <hr />
          <div className="!py-12">
            <EditForm />
          </div>
        </div>
      </div>
    </div>
  );
}
