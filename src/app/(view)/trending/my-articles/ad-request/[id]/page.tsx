import React from "react";
import Ad from "./ad";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const storage = await params;
  console.log(storage.id);

  return (
    <section className="py-12 px-4 lg:px-[7%]">
      <Ad />
    </section>
  );
}
