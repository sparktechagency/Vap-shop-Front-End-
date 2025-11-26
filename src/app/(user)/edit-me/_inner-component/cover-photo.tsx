"use client";
import React, { useState, useEffect } from "react";
import { PenBoxIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DropOff from "@/components/core/drop-off";
import { toast } from "sonner";
import { useUpdateUserMutation } from "@/redux/features/users/userApi";
import { UserData } from "@/lib/types/apiTypes";

export default function CoverPhoto({ my }: { my: UserData }) {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateUser] = useUpdateUserMutation();

  const [localCover, setLocalCover] = useState<string | null>(null);
  useEffect(() => {
    if (my.cover_photo) {
      setLocalCover(my.cover_photo);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (localCover?.startsWith("blob:")) {
        URL.revokeObjectURL(localCover);
      }
    };
  }, [localCover]);

  async function handleFileSelect(file: File) {
    const toastId = toast.loading("Uploading cover photo...");
    try {
      setUploading(true);

      const formData = new FormData();
      switch (parseInt(my.role)) {
        case 5:
          formData.append("store_name", my.first_name);
          formData.append("address", my.address?.address ?? "");
          formData.append("region_id", my.address?.region_id ?? "");
          formData.append("zip_code", my.address?.zip_code ?? "");
          break;
        case 3:
          formData.append("brand_name", my.brand_name);
          break;
        default:
          formData.append("first_name", my.first_name);
          formData.append("last_name", my.last_name);
          break;
      }
      formData.append("cover_photo", file);

      const result = await updateUser(formData).unwrap();

      if (!result.ok) {
        toast.error("Could not update your cover photo", {
          description: "Check if the format and size is suitable",
          id: toastId,
        });
      } else {
        const imageUrl = URL.createObjectURL(file);
        setLocalCover(imageUrl);
        toast.success("Cover photo updated successfully", { id: toastId });
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
    <div
      className="h-[250px] md:h-[350px] lg:h-[400px] w-full relative"
      style={{
        backgroundImage: localCover
          ? `url(${localCover})`
          : `linear-gradient(to top right, var(--background) 0%, rgba(128, 90, 213, 0.5) 40%, #331F60 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="bg-background flex gap-2 absolute bottom-0 right-0 !p-2 border shadow items-center cursor-pointer text-sm">
            <PenBoxIcon className="size-4" /> Set a cover photo
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Cover Photo</DialogTitle>
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
