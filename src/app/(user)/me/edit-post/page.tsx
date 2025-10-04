/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

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
  useGetPostByIdQuery,
  useUpdatePostMutation,
} from "@/redux/features/users/postApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

type PostForm = z.infer<typeof postSchema>;

export default function UpdatePostPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const router = useRouter();

  const { data, isLoading } = useGetPostByIdQuery(
    { id: postId! },
    { skip: !postId }
  );
  const [updatePost] = useUpdatePostMutation();

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Initialize form with fetched data
  useEffect(() => {
    if (!isLoading && data?.data) {
      form.setValue("title", data.data.title);
      form.setValue("content", data.data.content);
      setPreview(data.data.article_image || null);
    }
  }, [isLoading, data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(data?.data.article_image || null);
    }
  };

  const onSubmit = async (values: PostForm) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("_method", "PUT");
      if (selectedFile) formData.append("article_image", selectedFile);

      const response: { ok?: string } = await updatePost({
        id: postId!,
        data: formData,
      }).unwrap();

      if (response.ok) {
        toast.success("Post updated successfully.");
        router.push("/me");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Post update failed. Please try again."
      );
      console.error("Post update failed:", error);
    }
  };

  return (
    <section className="space-y-6 mt-6">
      <h1 className="text-3xl font-bold">Update Post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title input (optional) */}
          {/* Uncomment below if you want editable title */}
          {/* <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Title</FormLabel>
                <FormControl>
                  <Input placeholder="Post Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Image Upload */}
          <label className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden cursor-pointer relative">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <p className="text-gray-400">
                Drag & drop an image or click to select
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>

          {/* Content Editor */}
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

          <Button type="submit">Update</Button>
        </form>
      </Form>
    </section>
  );
}
