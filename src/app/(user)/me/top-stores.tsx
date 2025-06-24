/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import StoreProdCard from "@/components/core/store-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/userContext";
import React from "react";

export default function TopStores() {
  const user = useUser();

  if (!user) {
    return (
      <div className="grid lg:grid-cols-3 gap-6 pt-10! lg:p-12!">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-[400px]" />
        ))}
      </div>
    );
  }

  const role = parseInt(user.role ?? "", 10);
  const isMember = role === 6;

  if (!isMember) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        You don&apos;t have access to this
      </p>
    );
  }

  const favList = user.favourite_store_list ?? [];

  if (favList.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        You have no favourite stores yet
      </p>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 pt-10! lg:p-12!">
      {favList.map((store: any, i) => (
        <StoreProdCard data={store} key={i} />
      ))}
    </div>
  );
}
