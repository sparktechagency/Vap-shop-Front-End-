import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SkeletonMe() {
  return (
    <main className="mb-12!">
      <Skeleton className="w-full h-[40dvh]" />
      <div className="grid grid-cols-5 p-6!">
        <Skeleton className="col-span-1 h-full hidden lg:block" />
        <div className="col-span-5 lg:col-span-4 p-6! pb-0!">
          <div className="flex justify-end items-center gap-6 mt-12!">
            <Skeleton className="w-64 h-12" />
            <Skeleton className="w-64 h-12" />
          </div>
          <div className="mt-12!">
            <Separator />
            <div className="mt-12! grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
