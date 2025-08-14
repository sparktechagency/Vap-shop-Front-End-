"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/userContext";
import { useUpdateAboutMutation } from "@/redux/features/users/userApi";
import React, { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import howl from "@/lib/howl";

// Dynamically import JoditEditor for client-side only rendering
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


type FormData = {
  about: string;
};

export default function About() {
  const my = useUser();
  const [updateAbout, { isLoading }] = useUpdateAboutMutation();
  const editor = useRef(null);

  const { handleSubmit, control, watch, reset } = useForm<FormData>({
    defaultValues: {
      about: "",
    },
  });

  // Watch the 'about' field to update the preview in real-time
  const aboutValue = watch("about");

  // Fetch initial data and populate the form
  useEffect(() => {
    async function getAbout() {
      if (!my?.id) return;
      try {
        const call = await howl({ link: `about?user_id=${my.id}` });
        const aboutData = call?.data?.content || "";
        // Use reset to update the entire form's default values
        reset({ about: aboutData });
      } catch (error) {
        console.error("Failed to fetch about content:", error);
        toast.error("Could not load your 'About' information.");
      }
    }
    getAbout();
  }, [my?.id, reset]);

  // Form submission logic
  const onSubmit = async (data: FormData) => {
    const dataset = {
      content: data.about,
    };
    try {
      await updateAbout(dataset).unwrap();
      toast.success("About section updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update 'About' section.");
    }
  };

  // Jodit configuration - no 'buttons' array means all features are enabled
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Tell everyone a little bit about yourself...",
      height: "400px", // Adjusted for a standard 'About Me' section
    }),
    []
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">About</h1>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <Separator />

      {/* Controller for Jodit Editor Integration */}
      <Controller
        name="about"
        control={control}
        render={({ field }) => (
          <JoditEditor
            ref={editor}
            value={field.value}
            config={config}
            onBlur={field.onChange} // Updates form state when editor loses focus
          />
        )}
      />

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        {/* Securely render the HTML preview */}
        <div
          className="prose dark:prose-invert max-w-none rounded-md border p-4 bg-background"
          dangerouslySetInnerHTML={{
            // Sanitize the HTML to prevent XSS attacks
            __html: DOMPurify.sanitize(aboutValue || "<p>Start typing to see a preview...</p>"),
          }}
        />
      </div>
    </form>
  );
}
