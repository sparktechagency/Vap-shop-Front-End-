/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "primereact/editor";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useUpdateThreadMutation } from "@/redux/features/Forum/ForumApi";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { ThreadDetails } from "./page";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Content must be at least 10 characters"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostUpdate({
  id,
  groupId,
  closer,
  data,
}: {
  id: string;
  groupId: string;
  closer: () => void;
  data: ThreadDetails;
}) {
  const [createThread] = useUpdateThreadMutation();
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
  useEffect(() => {
    setValue("title", data.title);
    setValue("body", data.body);
    setEditorValue(data.body); // <-- this line is missing
  }, [data, setValue]);

  const token = Cookies.get("token");
  console.log("token", token);
  const onSubmit = async (data: PostFormData) => {
    if (!token) {
      return toast.error("Please login to update the thread.");
    }
    try {
      const finalData = {
        title: data.title,
        body: data.body,
        group_id: JSON.parse(groupId),
        _method: "PUT",
      };
      const res = await createThread({ id: id, body: finalData }).unwrap();

      if (res?.ok) {
        toast.success(res.message);
        setEditorValue("");
        closer();
      } else {
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update thread.");
      console.error("Create thread error:", err);
    }
  };
  const customHeader = (
    <>
      <span className="ql-formats">
        <select className="ql-header" />
        <select className="ql-font" />
        <select className="ql-size" />
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
      </span>
      <span className="ql-formats">
        <button className="ql-header" value="1" />
        <button className="ql-header" value="2" />
        <button className="ql-blockquote" />
        <button className="ql-code-block" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>
      <span className="ql-formats">
        <button className="ql-direction" value="rtl" />
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
        {/* ❌ removed ql-image and ql-video */}
      </span>
      <span className="ql-formats">
        <button className="ql-clean" />
      </span>
    </>
  );

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
          headerTemplate={customHeader}
        />
        {errors.body && (
          <p className="text-sm text-red-500">{errors.body.message}</p>
        )}
      </div>

      <Button type="submit">Post Forum</Button>
    </form>
  );
}
