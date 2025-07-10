import { Suspense } from "react";
import Subsc from "./subsc";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full h-[70dvh] p-12 grid grid-cols-3 gap-6">
            <Skeleton className="w-full" />
            <Skeleton className="w-full" />
            <Skeleton className="w-full" />
          </div>
        }
      >
        <Subsc />
      </Suspense>
    </>
  );
}
