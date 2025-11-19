/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BtbProductCard from "@/components/core/btb-product-card";
import { useMyBtbProductsQuery } from "@/redux/features/b2b/btbApi";
import { Loader2Icon } from "lucide-react";
import React from "react";

export default function BtBList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, isError, error }: any = useMyBtbProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center">
        {error.data.message ?? "Something went wrong"}
      </div>
    );
  }
  if (data) {
    console.log(data.data[0]);
  }

  return (
    <div className="grid grid-cols-4 gap-6 p-4">
      {data?.data?.map((x: any, i: number) => (
        <BtbProductCard
          link={`/me/manage/b2b/${x.product_id}`}
          key={i}
          show
          data={x}
        />
      ))}
    </div>
  );
}
