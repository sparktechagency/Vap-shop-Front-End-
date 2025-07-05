/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "primereact/editor";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useCreateThreadMutation } from "@/redux/features/Forum/ForumApi";
import { toast } from "sonner";
import Cookies from "js-cookie";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Content must be at least 10 characters"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostCreate({
  id,
  closer,
}: {
  id: string;
  closer: () => void;
}) {
  const [createThread] = useCreateThreadMutation();
  const [editorValue, setEditorValue] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });
  const token = Cookies.get("token");
  console.log("token", token);
  const onSubmit = async (data: PostFormData) => {
    if (!token) {
      return toast.error("Please login to create a thread.");
    }
    try {
      const finalData = {
        title: data.title,
        body: data.body,
        group_id: JSON.parse(id),
      };
      const res = await createThread(finalData).unwrap();

      if (res?.ok) {
        toast.success("Thread created successfully!");
        setEditorValue("");
        closer();
      } else {
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create thread.");
      console.error("Create thread error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6!">
      <div className="space-y-2!">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2!">
        <Label>Forum Content</Label>
        <Editor
          style={{ height: "300px" }}
          value={editorValue}
          onTextChange={(e) => {
            const html = e.htmlValue ?? "";
            setEditorValue(html);
            setValue("body", html, { shouldValidate: true });
          }}
        />
        {errors.body && (
          <p className="text-sm text-red-500">{errors.body.message}</p>
        )}
      </div>

      <Button type="submit">Post Forum</Button>
    </form>
  );
}
