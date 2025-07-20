import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { Suspense } from "react";
import Catalog from "./catalog";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="!my-12">
      <h1 className="text-4xl font-semibold !pb-4">Manage Products</h1>
      <Separator />
      <div className="!py-6 flex justify-end gap-4">
        {/* <Button asChild>
          <Link href="/me/manage/b2b">B2B</Link>
        </Button> */}
        <Button asChild>
          <Link href="/me/manage/add">Add New Products</Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="w-full grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12! px-6!">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square" />
            ))}
          </div>
        }
      >
        <Catalog />
      </Suspense>
    </div>
  );
}
