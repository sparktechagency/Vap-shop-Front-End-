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

  return (
    <div className="grid grid-cols-4 gap-6 p-4">
      {/* <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
        <code className="whitespace-pre-wrap">
          {JSON.stringify(data.data[0], null, 2)}
        </code>
      </pre> */}
      {data?.data?.map((x: any, i: number) => (
        <BtbProductCard
          link={`/me/manage/b2b/${x.product_id}?amount=${x?.b2b_details?.wholesale_price}&moq=${x?.b2b_details?.moq}`}
          key={i}
          show
          data={x}
          manage
        />
      ))}
    </div>
  );
}
