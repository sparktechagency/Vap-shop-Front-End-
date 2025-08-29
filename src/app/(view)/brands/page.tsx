/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BrandProdCard from "@/components/core/brand-prod-card";
import SliderWithSkeleton from "@/components/SliderWithSkeleton";
import { BrandType } from "@/lib/types/product";
import { useGetallBrandsQuery } from "@/redux/features/brand/brandApis";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton version of BrandProdCard
const BrandProdCardSkeleton = () => {
  return (
    <div className="!p-0 !gap-0 shadow-sm rounded-lg border overflow-hidden">
      <Skeleton className="w-full aspect-square rounded-t-lg" />
      <div className="!p-4 space-y-2 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-[40px]" />
        </div>
        <Skeleton className="h-3 w-[120px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </div>
  );
};

export default function Page() {
  const { data: brandsResponse, isLoading } = useGetallBrandsQuery();

  // Transform API data to match BrandType
  const transformBrandData = (apiBrand: any): BrandType => ({
    id: apiBrand.id.toString(),
    image: apiBrand.avatar || "/image/icon/brand.jpg",
    type: "normal",
    storeName: apiBrand.full_name || "Brand",
    isVerified: true,
    location: {
      city: "New York",
      distance: "4 mi",
    },
    rating: {
      value: apiBrand.avg_rating || 0,
      reviews: apiBrand.total_reviews || 0,
    },
    isOpen: true,
    closingTime: "10 PM",
    isFollowing: apiBrand.is_following || false,
    totalFollowers: apiBrand.total_followers || 0,
  });

  return (
    <div className="!my-12">
      <SliderWithSkeleton />
      <div className="!px-4 lg:!px-[7%] !mt-12">
        <h3 className="text-xl md:text-4xl font-semibold">Brands</h3>
        <div className="w-full flex justify-between items-center">
          {isLoading ? (
            <Skeleton className="h-5 w-[150px]" />
          ) : (
            <p className="text-muted-foreground">
              Showing {brandsResponse?.data?.data?.length || 0} brands
            </p>
          )}
          {/* <Button variant="link" asChild>
            <Link href="/map">
              <ArrowLeftIcon /> Map View
            </Link>
          </Button> */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <BrandProdCardSkeleton key={index} />
              ))
            : brandsResponse?.data?.data?.map((brand: any) => (
                <BrandProdCard
                  data={transformBrandData(brand)}
                  key={brand.id}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
