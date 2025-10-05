

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
import { Input } from "@/components/ui/input";

// It's good practice to define a type for your data structures.
interface Slider {
  id: number;
  image: string;
  link?: string;
}

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // State for image preview
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<any>(null);
  const [link, setLink] = useState('');

  // Fetch sliders
  const { data: slidersData, isLoading, refetch } = useGetAdminSlidersQuery();
  const sliders: Slider[] = slidersData?.data || [];

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
        toast.error('Only PNG, JPEG, and WebP images are allowed');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size must be less than 3MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // **FIX**: Decoupled upload logic from file selection.
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file first");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('link', link); // Link is now correctly included

    try {
      const res = await createSlider(formData).unwrap();
      if (res?.ok) {
        toast.success(res?.message || "Slider uploaded successfully");
        refetch(); // Refresh the slider list
        // Reset state after successful upload
        setSelectedFile(null);
        setPreviewUrl(null);
        setLink('');
      } else {
        toast.error(res?.message || 'Failed to upload slider');
      }
    } catch (error) {
      console.error('Error uploading slider:', error);
      toast.error('An unexpected error occurred during upload.');
    }
  };

  // **FIX**: Simplified delete handler to rely on state, not a parameter.
  const handleDelete = async () => {
    if (!sliderToDelete) return;
    try {
      const res = await deleteSlider({ id: sliderToDelete }).unwrap();
      if (res?.ok) {
        toast.success(res?.message || "Slider deleted successfully");
        refetch(); // Refresh the slider list
        setDeleteDialogOpen(false); // Close dialog on success
      } else {
        toast.error(res?.message || 'Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      toast.error('An unexpected error occurred during deletion.');
    }
  };

  // **FIX**: Reset the sliderToDelete state when the dialog closes.
  const handleDialogChange = (isOpen: boolean) => {
    setDeleteDialogOpen(isOpen);
    if (!isOpen) {
      setSliderToDelete(null);
    }
  }

  // Loading Skeleton
  if (isLoading) {
    return (
      <main className="flex-1 w-full bg-background rounded-xl !p-6">
        <h1 className="text-2xl text-center font-semibold !pb-6">Slider Management</h1>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
        {/* Upload Card */}
        <div className="border p-4 rounded-lg flex flex-col justify-between">
          <label
            htmlFor="imgup"
            className="cursor-pointer aspect-square text-muted-foreground w-full bg-inherit rounded-lg border-2 border-dashed flex flex-col justify-center items-center hover:bg-muted transition"
          >
            {previewUrl ? (
              <Image src={previewUrl} width={100} height={100} alt="Selected preview" className="object-cover rounded-lg h-[100px] w-[100px]" />
            ) : (
              <>
                <UploadIcon className="mb-2" />
                <p className="text-sm text-center">Select image</p>
                <p className="text-xs text-zinc-600 text-center px-1">
                  PNG, JPG, WebP supported (Max 3MB)
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
          <div className="mt-2 space-y-2">
            <Input
              type="text"
              placeholder="https://example.com"
              className="w-full"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={isCreating}
            />
            {/* **FIX**: Added an explicit upload button */}
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={!selectedFile || isCreating}
            >
              {isCreating ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>

        {/* Slider Items */}
        {sliders.map((slider) => (
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
              <Dialog open={deleteDialogOpen && sliderToDelete === slider.id} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button
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
                      Are you sure you want to delete this slider image? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete()} // **FIX**: No parameter needed
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
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