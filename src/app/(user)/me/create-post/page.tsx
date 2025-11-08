"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
import { useCreatePostMutation } from "@/redux/features/users/postApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { Upload, X } from "lucide-react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// ✅ Schema updated with gallery toggle
const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  is_in_gallery: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File[] | undefined>();
  const [postData] = useCreatePostMutation();
  const navig = useRouter();

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "...",
      content: "",
      is_in_gallery: false,
    },
  });

  const onSubmit = async (values: PostForm) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("is_in_gallery", values.is_in_gallery ? "1" : "0");
    formData.append("content_type", "post");

    if (selectedFile && selectedFile.length > 0) {
      selectedFile.forEach((file, i) => {
        formData.append(`images[]`, file);
      });
    }

    try {
      const response: { ok?: string } = await postData(formData).unwrap();
      if (response.ok) {
        toast.success("Post created successfully.");
        navig.push("/me");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Post creation failed. Please try again."
      );
      console.error("Post creation failed:", error);
    }
  };

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <section className="space-y-6 mt-6">
      <h1 className="text-3xl font-bold">Create a new post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ✅ File upload section */}
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
              {selectedFile?.map((file, index) => (
                <FileUploadItem key={index} value={file} className="p-0">
                  <FileUploadItemPreview className="size-20 [&>svg]:size-12">
                    <FileUploadItemProgress variant="circular" size={40} />
                  </FileUploadItemPreview>
                  <FileUploadItemMetadata className="sr-only" />
                  <FileUploadItemDelete asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="-top-1 -right-1 absolute size-5 rounded-full"
                    >
                      <X className="size-3" />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>

          {/* ✅ Content editor */}
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

          {/* ✅ Add to gallery toggle */}
          <FormField
            control={form.control}
            name="is_in_gallery"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(val)}
                />
                <Label>Add to Gallery</Label>
              </div>
            )}
          />

          <Button type="submit">Post</Button>
        </form>
      </Form>
    </section>
  );
}
