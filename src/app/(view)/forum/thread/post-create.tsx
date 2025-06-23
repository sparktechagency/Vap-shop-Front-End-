"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "primereact/editor";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const [editorValue, setEditorValue] = useState("");

  const onSubmit = (data: PostFormData) => {
    console.log({ ...data, content: editorValue });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title:</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label>Forum Content:</Label>
        <Editor
          style={{ height: "300px" }}
          value={editorValue}
          onTextChange={(e) => {
            const value = e.htmlValue ?? "";
            setEditorValue(value);
            setValue("content", value);
          }}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit">Post forum</Button>
    </form>
  );
}
