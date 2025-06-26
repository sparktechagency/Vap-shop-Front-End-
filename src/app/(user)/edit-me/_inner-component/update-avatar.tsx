"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenBoxIcon } from "lucide-react";
import DropOff from "@/components/core/drop-off";
import { toast } from "sonner";
import { useUpdateUserMutation } from "@/redux/features/users/userApi";
import { UserData } from "@/lib/types/apiTypes";

export default function UpdateAvatar({ my }: { my: UserData }) {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateUser] = useUpdateUserMutation();

  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup blob URL if any
      if (localAvatar?.startsWith("blob:")) {
        URL.revokeObjectURL(localAvatar);
      }
    };
  }, [localAvatar]);

  async function handleFileSelect(file: File) {
    const toastId = toast.loading("Uploading avatar...");
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("first_name", my.first_name);
      formData.append("avatar", file);

      const avUpdate = await updateUser(formData).unwrap();

      if (!avUpdate.ok) {
        toast.error("Could not update your avatar", {
          description: "Check if the format and size is suitable",
          id: toastId,
        });
      } else {
        const imageUrl = URL.createObjectURL(file);
        setLocalAvatar(imageUrl); // ✅ Update only the UI
        toast.success("Avatar updated successfully", { id: toastId });
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="size-[200px] relative">
      <Avatar className="h-full w-full">
        <AvatarImage src={localAvatar ?? my.avatar} className="object-cover" />
        <AvatarFallback>
          {my.first_name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="size-8 rounded-full absolute right-[7%] bottom-[7%] border bg-background flex justify-center items-center cursor-pointer">
            <PenBoxIcon className="size-4" />
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Image</DialogTitle>
          </DialogHeader>

          <DropOff onFileSelect={handleFileSelect} type="video" />
          {uploading && (
            <p className="text-center mt-2 text-sm">Uploading...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
