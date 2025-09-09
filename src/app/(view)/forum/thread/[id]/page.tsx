"use client";
import React from "react";
import Threader from "../threder";
import GoBack from "@/components/core/internal/go-back";
import { useParams, useSearchParams } from "next/navigation";

// Define the type for the data you expect to receive from the URL
// This should match the ForumGroupType from your ForumCard
interface ForumGroupType {
  id?: number;
  title?: string;
  description?: string;
  created_at?: string;
  total_threads?: number | string;
  total_comments?: number | string;
  // Add other properties if you need them
}

export default function Page() {
  // useParams gets the dynamic route parameter, e.g., the '3' in '/forum/thread/3'
  const { id } = useParams();

  // useSearchParams gets the query parameters, e.g., '?data=...'
  const searchParams = useSearchParams();

  let groupData: ForumGroupType | null = null;

  // Get the raw data string from the URL
  const dataString = searchParams.get("data");

  // Safely parse the data string if it exists
  if (dataString) {
    try {
      // Decode the URL-encoded string and then parse the JSON
      groupData = JSON.parse(decodeURIComponent(dataString));
    } catch (error) {
      console.error("Failed to parse group data from URL:", error);
      // Handle the error, maybe show a message to the user
    }
  }

  // Format the creation date for display
  const formattedDate = groupData?.created_at
    ? new Date(groupData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="!py-12 !px-2 md:!px-[7%]">
      <GoBack />

      {/* Display the title from the captured data */}
      <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
        {groupData?.title || "Forum"}
      </h1>

      <div className="!my-12">
        {/* Display the description from the captured data */}
        <h3 className="text-sm md:text-xl font-semibold">
          {groupData?.description || "Welcome to the forum."}
        </h3>

        {/* You can keep or remove this static list as needed */}
        <ul className="list-disc list-inside text-xs md:text-sm container !mx-auto !mt-4">
          <li>Ask questions related to vaping.</li>
          <li>Seek advice and guidance from the community.</li>
          <li>
            Receive assistance with technical issues, safety concerns, and other
            vaping-related matters.
          </li>
          <li>Promote responsible vaping practices and harm reduction.</li>
        </ul>
      </div>

      {/* --- NEW CONTENT START --- */}
      {/* This section displays metadata about the forum group */}
      {groupData && (
        <div className="my-8 flex flex-wrap gap-4 sm:gap-8 justify-center items-center text-center p-4 border-t border-b dark:border-gray-700">
          {formattedDate && (
            <div className="text-sm text-muted-foreground">
              <strong>Created on:</strong> {formattedDate}
            </div>
          )}
          {groupData?.total_threads !== undefined && (
            <div className="text-sm text-muted-foreground">
              <strong>Total Threads:</strong> {String(groupData.total_threads)}
            </div>
          )}
          {groupData?.total_comments !== undefined && (
            <div className="text-sm text-muted-foreground">
              <strong>Total Comments:</strong>{" "}
              {String(groupData.total_comments)}
            </div>
          )}
        </div>
      )}
      {/* --- NEW CONTENT END --- */}

      <div className="">
        <Threader id={id as string} />
      </div>
    </main>
  );
}
