/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Separator } from "@/components/ui/separator";
import BuissnessOrder from "./buissnessOrder";

export default function Page() {
  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Orders</h1>
      <Separator />
      <BuissnessOrder />
    </div>
  );
}
