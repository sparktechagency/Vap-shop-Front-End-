import React from "react";
import EditForm from "./edit-form";

// ✅ Async function প্রয়োজন কারণ EditForm async component expect করে
export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className="!py-12">
      <h2 className="mb-6! font-semibold text-3xl text-center">
        Edit product details
      </h2>

      {/* ✅ async server component */}
      <EditForm id={params.id} />
    </div>
  );
}
