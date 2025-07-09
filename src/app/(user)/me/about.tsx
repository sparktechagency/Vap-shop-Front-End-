/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/userContext";
import { useUpdateAboutMutation } from "@/redux/features/users/userApi";
import { Editor } from "primereact/editor";
import React from "react";
import { useForm } from "react-hook-form";
import DOMPurify from "dompurify";
import { toast } from "sonner";
type FormData = {
  about: string;
};

export default function About() {
  const my = useUser();
  const [updateAbout] = useUpdateAboutMutation();
  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      about: "",
    },
  });

  // Watch the value for live updates (controlled input)
  const aboutValue = watch("about");

  // PrimeReact doesn't integrate directly with register, so we use setValue manually
  const handleEditorChange = (e: any) => {
    setValue("about", e.htmlValue);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Submitted about:", data.about);
    const dataset = {
      content: data.about,
    };
    try {
      const res = await updateAbout(dataset).unwrap();
      console.log(res);

      if (res.ok) {
        toast.success("About us updated Successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(my);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6! pt-4!">
      <h1 className="text-3xl font-semibold">About Us</h1>

      <Editor
        value={aboutValue}
        onTextChange={handleEditorChange}
        style={{ height: "50dvh" }}
      />

      <Button type="submit">Update About Us</Button>

      <Separator />
      <h2 className="text-xl font-semibold mb-12">Preview:</h2>
      <article
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(aboutValue),
        }}
      />
    </form>
  );
}
