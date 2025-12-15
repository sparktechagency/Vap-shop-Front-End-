"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useGetPostsByIdQuery,
  useUpdatePostMutation,
} from "@/redux/features/users/postApi";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Loader2Icon, Upload, X } from "lucide-react";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import { cn } from "@/lib/utils";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface FileWithPreview extends File {
  preview?: string;
}

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  is_in_gallery: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

export default function Page() {
  const { id } = useUser();
  const postId = useSearchParams().get("id");
  const router = useRouter();

  const { data, isLoading } = useGetPostsByIdQuery({ id }, { skip: !id });
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      is_in_gallery: false,
    },
  });

  // ----------------------------
  // Load post
  // ----------------------------
  useEffect(() => {
    if (!isLoading && data?.data?.data) {
      const post = data.data.data.find(
        (x: any) => String(x.id) === String(postId)
      );

      if (!post) return;

      form.reset({
        title: post.title,
        content: post.content,
        is_in_gallery: Boolean(post.is_in_gallery),
      });

      setExistingImages(post.post_images ?? []);
    }
  }, [isLoading]);

  // ----------------------------
  // Remove existing image
  // ----------------------------
  const removeExistingImage = (img: any) => {
    setExistingImages((prev) => prev.filter((x) => x.id !== img.id));
    setDeletedImageIds((prev) => [...prev, String(img.id)]);
    console.log(String(img.id));
  };

  // ----------------------------
  // Submit
  // ----------------------------
  const onSubmit = async (values: PostForm) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("content", values.content ?? "");
    formData.append("is_in_gallery", values.is_in_gallery ? "1" : "0");
    formData.append("content_type", "post");
    formData.append("_method", "PUT");

    // deleted images
    deletedImageIds.forEach((id) => formData.append("deleted_image_ids[]", id));

    // new images only
    newFiles.forEach((file) => formData.append("images[]", file));

    try {
      const res = await updatePost({
        id: String(postId),
        data: formData,
      }).unwrap();

      toast.success(res.message ?? "Post updated");
      router.back();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Update failed");
    }
  };

  return (
    <section className="space-y-6 mt-6">
      <h1 className="text-3xl font-bold">Edit Post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div
              className={cn("grid gap-3", `grid-cols-${existingImages.length}`)}
            >
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <Image
                    src={img.image_path}
                    alt="post-img"
                    width={300}
                    height={300}
                    className="object-contain max-h-[300px]"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                    onClick={() => removeExistingImage(img)}
                  >
                    <X className="size-4" />
                  </Button>
                  {img.id}
                </div>
              ))}
            </div>
          )}

          {/* New Uploads */}
          <FileUpload
            value={newFiles}
            onValueChange={setNewFiles}
            maxFiles={10}
            maxSize={5 * 1024 * 1024}
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1">
                <Upload className="size-6 text-muted-foreground" />
                <p className="text-sm">Add new images</p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  Browse
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>

            <FileUploadList orientation="horizontal">
              {newFiles.map((file, i) => (
                <FileUploadItem key={i} value={file}>
                  <FileUploadItemPreview>
                    {file.preview ? (
                      <img
                        src={file.preview}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FileUploadItemProgress variant="circular" size={40} />
                    )}
                  </FileUploadItemPreview>
                  <FileUploadItemDelete asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        setNewFiles((p) => p.filter((_, x) => x !== i))
                      }
                    >
                      <X className="size-3" />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Content</FormLabel>
                <FormControl>
                  <JoditEditor value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gallery */}
          <FormField
            control={form.control}
            name="is_in_gallery"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label>Keep in Gallery</Label>
              </div>
            )}
          />

          <Button type="submit" disabled={updating}>
            {updating ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Update Post"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
}
