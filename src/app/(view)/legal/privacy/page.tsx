'use client';

import { useGettermspagesQuery } from "@/redux/features/admin/AdminApis";
import { useSearchParams } from "next/navigation";
import React from "react";
import DOMPurify from 'dompurify';

export default function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'privacy-policy';
console.log('type:', type);
  // 1. Make sure to get `error` from the hook
  const { data: pageData, isLoading } = useGettermspagesQuery({ type: type });

  // Handle loading state
  if (isLoading) {
    return <div className="!my-[100px] !px-4 md:!px-[7%]">Loading...</div>;
  }

  if(!pageData?.data?.content) {
    return <div className="!my-[100px] !px-4 md:!px-[7%]">No content available.</div>;
  }
  const sanitizedContent = DOMPurify.sanitize(pageData?.data?.content);
  return (
    // 3. The JSX was nested one level too deep. I've cleaned it up.
    <div className="!my-[100px] !px-4 md:!px-[7%] 
      prose max-w-none 
      prose-h1:text-4xl prose-h1:font-bold prose-h1:text-blue-600"
    >
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
}