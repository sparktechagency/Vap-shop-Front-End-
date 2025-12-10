"use client";

import ProductCard from "@/components/core/product-card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useGetFavProductsQuery } from "@/redux/features/others/otherApi";
import { InboxIcon, Loader2Icon } from "lucide-react";
import React from "react";

export default function Page() {
  const { data, isLoading, isError, error }: any = useGetFavProductsQuery();

  if (isLoading) {
    return (
      <div className="p-6 py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>{error?.data?.message}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <section className="w-full border-t py-8 mt-4">
      <h4 className="text-center text-2xl"> Favourite product list</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {data?.data?.map((x: any) => (
          <ProductCard
            key={x.id}
            data={{
              id: x.id,
              image: x?.details?.product_image,
              title: x?.details?.product_name,
              category: x?.details?.brand_name,
              note: "",
              hearts: x?.details?.total_heart,
              is_hearted: x?.details?.is_hearted,
              thc_percentage: x?.details?.thc_percentage,
            }}
            link={
              x?.details.role === 4
                ? `/profile/product/${x.id}`
                : x?.details?.role === 3
                ? `/brands/brand/product/${x.id}`
                : `/stores/store/product/${x.id}`
            }
          />
        ))}
        {/* {data?.data?.map((x: any) => (
          <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
            <code className="whitespace-pre-wrap">
              {JSON.stringify(x, null, 2)}
            </code>
          </pre>
        ))} */}
      </div>
    </section>
  );
}
