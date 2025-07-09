import React, { Suspense } from "react";
import EditForm from "./edit-form";

// ✅ Define correct type for `params`
type PageProps = {
  params: {
    id: string;
  };
};

// ✅ No need to make this function async if you're not using await
export default function Page({ params }: PageProps) {
  return (
    <div className="!py-12">
      <h2 className="mb-6! font-semibold text-3xl text-center">
        Edit product details
      </h2>

      <Suspense
        fallback={
          <div className="h-24 w-full flex items-center justify-center">
            loading...
          </div>
        }
      >
        {/* ✅ Pass the ID from params to EditForm */}
        <EditForm id={params.id} />
      </Suspense>
    </div>
  );
}
