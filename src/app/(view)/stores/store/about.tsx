/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetstoreAboutQuery } from "@/redux/features/store/StoreApi";
import { Loader } from "lucide-react";
import React from "react";
import DOMPurify from "dompurify";
export default function About({ id }: { id: any }) {
  const { data, isLoading, error, isError } = useGetstoreAboutQuery(id);
  console.log("about", data);

  if (isError) {
    console.log("error", error);
  }

  if (data) {
    console.log(data.data.content);
  }

  if (isLoading) return <Loader />;
  return (
    <div className="!my-12 !space-y-8">
      <div>
        <h1 className="!mb-4 text-xl lg:text-4xl font-semibold">WHO ARE WE?</h1>
        <p
          className="text-xs md:text-sm xl:text-base line-clamp-1"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data?.data?.content || "No Description"),
          }}
        />
      </div>
    </div>
  );
}
