/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Separator } from "@/components/ui/separator";
import BuissnessOrder from "./buissnessOrder";
import { useUser } from "@/context/userContext";
import MemberOrder from "./MemberOrder";

export default function Page() {
  const { role } = useUser();
  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Orders</h1>
      <Separator />
      {["5", "3", "4"].includes(String(role)) ? (
        <BuissnessOrder />
      ) : (
        <MemberOrder />
      )}
    </div>
  );
}
