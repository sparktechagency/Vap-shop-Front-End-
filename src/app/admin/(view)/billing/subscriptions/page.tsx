import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="h-full w-full border rounded-xl !p-6">
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card className="w-full !h-auto !p-4" key={i}>
            <h2 className="text-2xl font-bold">🧾 Core Features</h2>
            <ul className="!space-y-4 text-xs">
              <li>
                <b>🏪 Full Store Profile Page</b> Display your branding, product
                listings, store hours, photos, contact info, and social links.
              </li>
              <li>
                <b>🏪 Full Store Profile Page</b> Display your branding, product
                listings, store hours, photos, contact info, and social links.
              </li>
              <li>
                <b>🏪 Full Store Profile Page</b> Display your branding, product
                listings, store hours, photos, contact info, and social links.
              </li>
              <li>
                <b>🏪 Full Store Profile Page</b> Display your branding, product
                listings, store hours, photos, contact info, and social links.
              </li>
            </ul>
            <div className="w-full grid grid-cols-2 gap-4">
              <Button className="" asChild>
                <Link href="subscriptions/edit">Edit Subscription</Link>
              </Button>
              <Button className="" variant="destructive">
                Delete Subscription
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Button className="fixed bottom-10 right-10" asChild>
        <Link href="subscriptions/add">
          <PlusIcon /> Add Subscription
        </Link>
      </Button>
    </div>
  );
}
