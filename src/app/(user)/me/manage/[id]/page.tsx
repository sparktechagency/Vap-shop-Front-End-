import React, { Suspense } from "react";
import EditForm from "./edit-form";

export default async function Page({ params }: { params: { id: string } }) {
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
        <EditForm id={params.id} />
      </Suspense>
    </div>
  );
}
