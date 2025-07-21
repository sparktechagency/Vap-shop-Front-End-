/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BrandProdCard from "@/components/core/brand-card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserData } from "@/lib/types/apiTypes";
import React from "react";

export default function TopBrands({ user }: { user: UserData }) {
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
      <p className="text-center text-sm text-muted">
        You don&apos;t have access to this
      </p>
    );
  }

  const favList = user.favourite_brand_list ?? [];

  if (favList.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        You have no favourite brands yet
      </p>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 pt-10! lg:p-12!">
      {favList.map((brand: any, i) => (
        <BrandProdCard data={brand} key={i} />
      ))}
    </div>
  );
}
