"use client";
import { useGetstoreAboutQuery } from "@/redux/features/store/StoreApi";
import { Loader } from "lucide-react";
import React from "react";
import DOMPurify from "dompurify"; // 1. Import DOMPurify

export default function About({ id }: { id: any }) {
  const { data, isLoading, error, isError } = useGetstoreAboutQuery(id);

  if (isError) {
    // It's good practice to log the error for debugging
    console.error("Failed to fetch about page content:", error);
  }

  if (isLoading) {
    // Use a more visually appealing loader if available, but this works
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // 2. Sanitize the HTML content before rendering
  // Check if data and the content property exist before trying to sanitize
  const sanitizedContent = data?.data?.content
    ? DOMPurify.sanitize(data.data.content)
    : "";

  return (
    <div className="!my-12 !space-y-8">
      <div>
        <h1 className="!mb-4 text-xl lg:text-4xl font-semibold">WHO ARE WE?</h1>

        {/* 3. Use dangerouslySetInnerHTML with the sanitized content */}
        {/* This tells React "I know this is risky, but I've already cleaned the HTML" */}
        <div
          className="prose dark:prose-invert text-xs md:text-sm lg:text-base text-muted-foreground max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Show a message if there's no content */}
        {!sanitizedContent && !isLoading && (
          <p className="text-muted-foreground">No content available.</p>
        )}
      </div>
    </div>
  );
}
