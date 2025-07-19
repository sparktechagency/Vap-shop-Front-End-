/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/userContext";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
export default function LatestReviewCard({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);
  const my = useUser();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  console.log("rating", data);
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden w-full">
      <div className="p-4 flex items-center gap-2 bg-secondary">
        <Avatar>
          <AvatarImage src={my.avatar} className="object-cover" />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
        <h4 className="text-sm font-semibold">{my.full_name}</h4>
      </div>
      {/* Review Content */}
      <div className="p-4 !pb-1">
        <p className="text-sm leading-relaxed !mb-4">{data?.comment}</p>

        {/* Reviewer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground">
                {data?.updated_at
                  ? new Date(data?.updated_at).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          </div>
          {data?.rating && (
            <div className="!mb-3">
              <h4 className="font-semibold text-xs !mb-2">
                ⭐ {parseFloat(data?.rating).toFixed(1)}/5
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
