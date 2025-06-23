/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

type PostForm = z.infer<typeof postSchema>;

export default function Page() {
  const navig = useRouter();
  const [postData] = useCreatePostMutation();
  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (values: PostForm) => {
    console.log(values);

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

  return (
    <section className="space-y-6! mt-6!">
      <h1 className="text-3xl font-bold">Create a new post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6!">
          <FormField
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
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write something..."
                    className="h-[30dvh]"
                    {...field}
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
