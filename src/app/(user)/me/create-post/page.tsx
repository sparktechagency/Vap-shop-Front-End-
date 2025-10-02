/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// import { Input } from "@/components/ui/input";
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
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

type PostForm = z.infer<typeof postSchema>;

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navig = useRouter();
  const [postData] = useCreatePostMutation();
  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "...",
      content: "",
    },
  });

  const onSubmit = async (values: PostForm) => {
    //TODO: add image api
    console.log(selectedFile);

    try {
      const response: { ok?: string } = await postData({
        title: values.title,
        content: values.content,
      }).unwrap();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="space-y-6! mt-6!">
      <h1 className="text-3xl font-bold">Create a new post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6!">
          {/* <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Title</FormLabel>
                <FormControl>
                  <Input placeholder="Your post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Content</FormLabel>
                <FormControl>
                  <JoditEditor
                    value={field.value} // ✅ bind RHF value
                    onChange={(newContent) => field.onChange(newContent)} // ✅ update RHF
                    className="h-[30dvh]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Post</Button>
        </form>
      </Form>
    </section>
  );
}
