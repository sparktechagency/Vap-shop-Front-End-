/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Separator } from "@/components/ui/separator";
import BuissnessOrder from "./buissnessOrder";
import { useUser } from "@/context/userContext";
import MemberOrder from "./MemberOrder";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { role } = useUser();
  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Reservation</h1>
      <Separator />
      {["5", "3", "4"].includes(String(role)) && (
        <div className="mt-6 flex justify-end">
          <Button variant={"outline"} asChild>
            <Link href={"/me/orders/b2b"}>Manage B2B requests</Link>
          </Button>
        </div>
      )}
      {["5", "3", "4"].includes(String(role)) ? (
        <BuissnessOrder />
      ) : (
        <MemberOrder />
      )}
    </div>
  );
}
