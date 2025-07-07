"use client";
import React from "react";
import Manual from "./manual";
// import Import from "./import";

export default function Page() {
  return (
    <div className="!py-12">
      <h2 className="mb-6! font-semibold text-3xl text-center">
        Edit product details
      </h2>
      <Manual />
    </div>
  );
}
