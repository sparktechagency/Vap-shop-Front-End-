"use client";
import { useUser } from "@/context/userContext";
import React from "react";
import Catalog from "./catalog";

export default function Page() {
  const { full_name } = useUser();

  return (
    <section className="border-t mt-6">
      <h1 className="text-center font-semibold mt-6 text-2xl">
        {full_name}&apos;s Most hearted
      </h1>
      <div className="">
        <Catalog />
      </div>
    </section>
  );
}
