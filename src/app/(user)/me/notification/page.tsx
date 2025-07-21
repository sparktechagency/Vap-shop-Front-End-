import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import Notifications from "./notifications";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-6 pb-12">
      <Suspense
        fallback={Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-18 w-full" />
        ))}
      >
        <Notifications />
      </Suspense>
    </div>
  );
}
