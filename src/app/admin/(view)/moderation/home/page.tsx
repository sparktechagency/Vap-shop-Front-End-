'use client';
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
import React, { useState } from "react";
import { useGetAdminSlidersQuery, useCreateAdminSliderMutation, useDeleteAdminSliderMutation } from "@/redux/features/admin/AdminApis";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<number | null>(null);

  // Fetch sliders
  const { data: slidersData, isLoading, refetch } = useGetAdminSlidersQuery();
  const sliders = slidersData?.data || [];

  // Mutations
  const [createSlider, { isLoading: isCreating }] = useCreateAdminSliderMutation();
  const [deleteSlider, { isLoading: isDeleting }] = useDeleteAdminSliderMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      const maxSize = 3 * 1024 * 1024; // 3MB

      if (!validTypes.includes(file.type)) {
        alert('Only PNG, JPEG, and WebP images are allowed');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 3MB');
        return;
      }

      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    console.log('file', file);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await createSlider(formData).unwrap();
      if (res?.ok) {
        toast.success(res?.message || "Slider uploaded successfully");
        refetch(); // Refresh the slider list
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading slider:', error);
      toast.error('Failed to upload slider');
    }
  };

  const handleDelete = async (id: string) => {
    // const id = JSON.parse(getedid);
    if (!sliderToDelete) return;

    try {
      const res = await deleteSlider({ id }).unwrap();
      console.log('res', res);
      if (res?.ok) {
        toast.success(res?.message || "Slider deleted successfully");
        refetch(); // Refresh the slider list
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      toast.error('Failed to delete slider');
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 w-full bg-background rounded-xl !p-6">
        <h1 className="text-2xl text-center font-semibold !pb-6">Choose slider</h1>
        <div className="w-full grid grid-cols-6 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full bg-background rounded-xl !p-6">
      <h1 className="text-2xl text-center font-semibold !pb-6">Slider Management</h1>

      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {/* Upload Button */}
        <label
          htmlFor="imgup"
          className={`cursor-pointer aspect-square text-muted-foreground w-full bg-inherit rounded-lg border-2 border-dashed flex flex-col justify-center items-center hover:bg-muted transition ${isCreating ? '' : ''
            }`}
        >
          {isCreating ? (
            <>
              <UploadIcon className="mb-2 animate-pulse" />
              <p className="text-sm text-center">Uploading...</p>
            </>
          ) : (
            <>
              <UploadIcon className="mb-2" />
              <p className="text-sm text-center">Select image to upload</p>
              <p className="text-xs text-zinc-600 text-center">
                Only png, jpeg, webp are supported <br /> (Max file size 3MB)
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            id="imgup"
            onChange={handleFileChange}
            disabled={isCreating}
          />
        </label>

        {/* Slider Items */}
        {sliders.map((slider: any) => (
          <div
            key={slider.id}
            className="relative group aspect-square w-full rounded-lg overflow-hidden"
          >
            <Image
              src={slider.image}
              alt={`Slider ${slider.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="hidden group-hover:flex absolute z-50 h-full w-full left-0 top-0 justify-center items-center hover:bg-background/70 rounded-lg">
              <Dialog open={deleteDialogOpen && sliderToDelete === slider.id} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className=""
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSliderToDelete(slider.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <TrashIcon className="text-destructive" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this slider image?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(slider.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}