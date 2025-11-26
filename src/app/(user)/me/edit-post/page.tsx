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
  FileUploadItemMetadata,
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

// ----------------------------
// Extend File type for preview
// ----------------------------
interface FileWithPreview extends File {
  preview?: string;
}

// ----------------------------
// Schema
// ----------------------------
const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  is_in_gallery: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview[]>([]);
  const { id } = useUser();
  const postId = useSearchParams().get("id");
  const { data, isLoading } = useGetPostsByIdQuery({ id }, { skip: !id });
  const [updatedImg, setUpdatedImg] = useState(false);
  const navig = useRouter();
  const [activeFiles, setActiveFiles] = useState<string[] | null>(null);
  const [updatePost, { isLoading: updating, isSuccess }] =
    useUpdatePostMutation();
  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "...",
      content: "",
      is_in_gallery: false,
    },
  });

  // ----------------------------
  // Load existing post
  // ----------------------------
  useEffect(() => {
    if (!isLoading && data?.data?.data) {
      const currentPost = data.data.data.find(
        (x: any) => String(x.id) === String(postId)
      );
      if (currentPost) {
        form.reset({
          title: currentPost.title,
          content: currentPost.content,
          is_in_gallery: Boolean(currentPost.is_in_gallery),
        });
        if (currentPost?.post_images.length > 0) {
          setActiveFiles(currentPost?.post_images);
        } else {
          setUpdatedImg(true);
        }
      }
    }
  }, [isLoading]);

  // ----------------------------
  // File reject
  // ----------------------------
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  // ----------------------------
  // Submit: FormData ready
  // ----------------------------
  const onSubmit = async (values: PostForm) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("is_in_gallery", values.is_in_gallery ? "1" : "0");
    formData.append("content_type", "post");
    formData.append("_method", "PUT");
    // Append all files (existing + new)
    if (updatedImg) {
      selectedFile.forEach((file) => formData.append("images[]", file));
    }
    try {
      const res = await updatePost({ id: String(postId), data: formData });

      if (isSuccess) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the post");
    }
    // Log FormData
    console.log("=== FORM DATA ===");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  return (
    <section className="space-y-6 mt-6">
      <h1 className="text-3xl font-bold">Edit Post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          {!!activeFiles && !updatedImg && (
            <div
              className={cn(
                `w-full min-h-[300px] p-6 border grid gap-2 relative`,
                `grid-cols-${activeFiles.length}`
              )}
            >
              {activeFiles?.map((x: any, i) => (
                <Image
                  alt="img-post"
                  className="w-full max-h-[300px] object-contain aspect-square"
                  height={500}
                  width={500}
                  key={i}
                  src={x.image_path}
                />
              ))}
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-2xl opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant={"special"}
                  onClick={() => {
                    setUpdatedImg(true);
                  }}
                >
                  Update Images
                </Button>
              </div>
            </div>
          )}
          {updatedImg && (
            <FileUpload
              value={selectedFile}
              onValueChange={setSelectedFile}
              maxFiles={10}
              maxSize={5 * 1024 * 1024}
              className="w-full"
              onFileReject={onFileReject}
              multiple
            >
              <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center justify-center rounded-full border p-2.5">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">Drag & drop files here</p>
                  <p className="text-muted-foreground text-xs">
                    Or click to browse (max 10 files, up to 5MB each)
                  </p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    Browse files
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>

              <FileUploadList orientation="horizontal">
                {selectedFile.map((file, index) => (
                  <FileUploadItem key={index} value={file} className="p-0">
                    <FileUploadItemPreview>
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileUploadItemProgress variant="circular" size={40} />
                      )}
                    </FileUploadItemPreview>

                    <FileUploadItemMetadata className="sr-only" />
                    <FileUploadItemDelete asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="-top-1 -right-1 absolute size-5 rounded-full"
                        onClick={() =>
                          setSelectedFile((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <X className="size-3" />
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
          )}

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Content</FormLabel>
                <FormControl>
                  <JoditEditor
                    value={field.value}
                    onChange={(newContent) => field.onChange(newContent)}
                    className="h-[30dvh]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gallery Toggle */}
          <FormField
            control={form.control}
            name="is_in_gallery"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(val)}
                />
                <Label>Keep in Gallery</Label>
              </div>
            )}
          />

          <Button type="submit" disabled={updating}>
            {!!updating ? (
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
