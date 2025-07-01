/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { useUpdateUserMutation } from "@/redux/features/users/userApi";
import { Editor } from "primereact/editor";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  about: string;
};

export default function About() {
  const my = useUser();
  const [updateUser] = useUpdateUserMutation();
  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      about: my.about ?? "",
    },
  });

  // Watch the value for live updates (controlled input)
  const aboutValue = watch("about");

  // PrimeReact doesn't integrate directly with register, so we use setValue manually
  const handleEditorChange = (e: any) => {
    setValue("about", e.htmlValue);
  };

  console.log(my);

  const onSubmit = async (data: FormData) => {
    console.log("Submitted about:", data.about);
    const dataset = {
      address: my.address?.address,
      zip_code: my.address?.zip_code,
      region_id: String(my.address?.region_id),
      about: data.about,
      ...(String(my.role) === "3"
        ? { brand_name: my.full_name }
        : { store_name: my.full_name }),
    };
    try {
      const res = await updateUser(dataset).unwrap();
      console.log(res);

      if (res.ok) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6! pt-4!">
      <h1 className="text-3xl font-semibold">About Us</h1>

      <Editor
        value={aboutValue}
        onTextChange={handleEditorChange}
        style={{ height: "50dvh" }}
      />

      <Button type="submit">Update About Us</Button>
    </form>
  );
}
