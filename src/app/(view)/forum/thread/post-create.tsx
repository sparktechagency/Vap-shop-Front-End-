


"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useRef } from "react";
import { useCreateThreadMutation } from "@/redux/features/Forum/ForumApi";
import { toast } from "sonner";
import Cookies from "js-cookie";

// Dynamically import JoditEditor for client-side only rendering
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// Zod schema for form validation
const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  body: z.string().min(10, "Content must be at least 10 characters long."),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostCreate({
  id,
  closer,
}: {
  id: string;
  closer: () => void;
}) {
  const [createThread, { isLoading }] = useCreateThreadMutation();
  const editor = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  // Configuration for the Jodit Editor, memoized for performance
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Write your thoughts here...',
      height: 300,
      // By removing the 'buttons' and 'removeButtons' properties,
      // Jodit will display its full default toolbar.
    }),
    []
  );

  const onSubmit = async (data: PostFormData) => {
    const token = Cookies.get("token");
    if (!token) {
      return toast.error("Please log in to create a thread.");
    }
    try {
      const finalData = {
        ...data,
        group_id: JSON.parse(id),
      };
      await createThread(finalData).unwrap();

      toast.success("Thread created successfully!");
      reset();
      closer();

    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create thread.");
      console.error("Create thread error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} disabled={isLoading} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Content</Label>
        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <JoditEditor
              ref={editor}
              value={field.value}
              config={config}
              onBlur={field.onChange}
              onChange={field.onChange}
            />
          )}
        />
        {errors.body && (
          <p className="text-sm text-red-500">{errors.body.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Posting..." : "Post Thread"}
      </Button>
    </form>
  );
}