import React from "react";
import PostCreate from "./post-edit";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const pars = await params;
  return (
    <div>
      <PostCreate id={pars.id} />
    </div>
  );
}
