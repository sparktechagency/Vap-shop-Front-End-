'use client';

import { useGettermspagesQuery } from "@/redux/features/admin/AdminApis";
import { useSearchParams } from "next/navigation";
import React from "react";
import DOMPurify from 'dompurify'; // 1. Import DOMPurify

export default function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'privacy-policy'; // Set a default type
  const { data: pageData, error, isLoading } = useGettermspagesQuery({ type: type });

  // 2. Handle loading and error states
  if (isLoading) {
    return <div className="!my-[100px] !px-4 md:!px-[7%]">Loading...</div>;
  }

  if (error || !pageData?.data?.content) {
    return <div className="!my-[100px] !px-4 md:!px-[7%]">Error: Could not load content.</div>;
  }

  // 3. Sanitize the HTML content from the API response
  const sanitizedContent = DOMPurify.sanitize(pageData.data.content);

  return (
    <div className="!my-[100px] !px-4 md:!px-[7%] prose max-w-none">
      {/* 4. Render the sanitized HTML */}
      <div className="!my-[100px] !px-4 md:!px-[7%] 
  prose max-w-none 
  prose-h1:text-4xl prose-h1:font-bold prose-h1:text-blue-600" // <-- Add custom h1 styles here
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </div>
  );
}