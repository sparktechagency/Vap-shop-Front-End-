"use client";

import React from "react";
import { z } from "zod";

import { useGetFavouriteQuery } from "@/redux/features/AuthApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Zod Schema
const formSchema = z.object({
  favStores: z.array(z.string().min(1, "Please select a store")),
  favBrands: z.array(z.string().min(1, "Please select a brand")),
});

type FormValues = z.infer<typeof formSchema>;

export default function FavControl() {
  const { data: brandsData, isLoading: brandsLoading } =
    useGetFavouriteQuery(5);
  const { data: storesData, isLoading: storesLoading } =
    useGetFavouriteQuery(3);

  const onSubmit = (data: FormValues) => {
    console.log("Form Data: ", data);
  };
  return (
    <div className="w-full grid grid-cols-2 gap-6">
      <div className="col-span-2">
        <h2 className="text-center font-semibold text-2xl">
          Favourite stores and brands
        </h2>
      </div>
      <div className="border p-4 rounded-md space-y-2">
        <div className="text-base border-b p-4 pt-0! mb-2 font-semibold text-center">
          Favourite Stores
        </div>
        {brandsData?.data?.map((x: any, i: number) => (
          <Button className="w-full" variant="outline" key={i} asChild>
            <Link
              href={`/stores/store/${x.id}`}
              className="border p-2 rounded-md"
            >
              {x.full_name}
            </Link>
          </Button>
        ))}
      </div>
      <div className="border p-4 rounded-md space-y-2">
        <div className="text-base border-b p-4 pt-0! mb-2 font-semibold text-center">
          Favourite Brands
        </div>
        {storesData?.data?.map((x: any, i: number) => (
          <Button className="w-full" variant="outline" key={i} asChild>
            <Link
              href={`/brands/brand/${x.id}`}
              className="border p-2 rounded-md"
            >
              {x.full_name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
