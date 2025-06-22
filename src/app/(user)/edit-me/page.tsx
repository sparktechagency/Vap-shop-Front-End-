import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenBoxIcon } from "lucide-react";
import React, { Suspense } from "react";
import DropOff from "../../../components/core/drop-off";
import UserEditForm from "./edit-form";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";
import howl from "@/lib/howl";
import { UserData } from "@/lib/types/apiTypes";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;
  const call = await howl({ link: "me", token });

  const my: UserData = call.data;
  return (
    <div className="!p-12">
      <div className="">
        <Suspense fallback={<Skeleton className="size-[200px] rounded-full" />}>
          <div className="size-[200px] relative">
            <Avatar className="h-full w-full">
              <AvatarImage
                src="/image/icon/user.jpeg"
                className="object-cover"
              />
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
        </Suspense>
        <div className="!py-12">
          <h1 className="text-3xl font-semibold !pb-2">
            Edit {my.role_label} Profile
          </h1>
          <hr />
          <div className="!py-12">
            <UserEditForm />
          </div>
        </div>
      </div>
    </div>
  );
}
