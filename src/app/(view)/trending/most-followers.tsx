/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BrandProdCard from "@/components/core/brand-prod-card";
import React, { useState, useEffect } from "react";
import {
  useGetmostFollowrsBrandQuery,
  useGetSponsoredBrandsQuery,
} from "@/redux/features/Trending/TrendingApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountysQuery } from "@/redux/features/AuthApi";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDownIcon, ChevronLeft, Globe } from "lucide-react";

export default function MostFollowers() {
  const [region, setRegion] = useState(""); // empty = worldwide
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchMostFollowers,
  }: any = useGetmostFollowrsBrandQuery({ region });

  const {
    data: sponsored,
    isLoading: sponsoredLoading,
    isError: isSponsoredError,
    error: sponsoredError,
    refetch: refetchSponsored,
  }: any = useGetSponsoredBrandsQuery({ region });

  const { data: countries, isLoading: cLoading } = useCountysQuery();

  useEffect(() => {
    refetchMostFollowers();
    refetchSponsored();
  }, [region, refetchMostFollowers, refetchSponsored]);

  const handleSelectRegion = (val: string) => {
    setRegion(val);
    setOpen(false);
  };

  if (isLoading || sponsoredLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Region Popover */}
      <div className="w-full flex justify-end items-center gap-6 !my-6">
        {!cLoading && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-[180px] justify-between transition"
              >
                {region === ""
                  ? "Worldwide"
                  : (() => {
                      const country = countries?.data?.find((c: any) =>
                        c.regions.some((r: any) => r.id.toString() === region)
                      );
                      const regionData = country?.regions?.find(
                        (r: any) => r.id.toString() === region
                      );
                      return regionData
                        ? `${regionData.name} (${regionData.code})`
                        : "Select Region";
                    })()}
                <ChevronDownIcon
                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[340px]! p-2" align="end">
              {selectedCountry ? (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCountry(null)}
                    className="text-muted-foreground flex items-center gap-1 mb-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  {selectedCountry.regions.map((r: any) => (
                    <Button
                      key={r.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSelectRegion(r.id.toString())}
                    >
                      {r.name} ({r.code})
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectRegion("")}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Globe className="w-4 h-4" /> Worldwide
                  </Button>

                  {countries?.data?.map((c: any) => (
                    <Button
                      key={c.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCountry(c)}
                    >
                      {c.name}
                    </Button>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Sponsored brands */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {isSponsoredError ? (
          <div className="py-4 col-span-4 flex justify-center items-center">
            {sponsoredError?.data?.message}
          </div>
        ) : (
          <>
            {sponsored?.data?.map((item: any, i: number) => (
              <BrandProdCard
                data={{
                  id: item?.id,
                  image: item?.user?.avatar,
                  storeName: item?.full_name,
                  is_favourite: item?.is_favourite,
                  isVerified: true,
                  location: {
                    city: "BROOKLYN, New York",
                    distance: "4 mi",
                  },
                  rating: {
                    value: item?.avg_rating,
                    reviews: item?.total_reviews,
                  },
                  isOpen: true,
                  closingTime: item?.end_date,
                  type: "ad",
                  isFollowing: item?.is_following,
                  totalFollowers: item?.total_followers,
                }}
                key={i}
              />
            ))}
            {sponsored?.data?.length <= 0 && (
              <div className="flex justify-center items-center h-12 w-full">
                No Sponsored Brands Found
              </div>
            )}
          </>
        )}
      </div>

      <h2 className="font-semibold text-2xl !mt-12 text-center">
        Top 50 Most Followed Brands
      </h2>

      {/* Most followed brands */}
      {isError ? (
        <div className="py-4 flex justify-center items-center">
          {error?.data?.message}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
          {data?.data?.map((item: any, i: number) => (
            <BrandProdCard
              data={{
                id: item?.id,
                image: item?.avatar,
                storeName: item?.full_name,
                is_favourite: item?.is_favourite,
                isVerified: true,
                location: {
                  city: "BROOKLYN, New York",
                  distance: "4 mi",
                },
                rating: {
                  value: item?.avg_rating,
                  reviews: item?.total_reviews,
                },
                isOpen: true,
                closingTime: "10 PM",
                type: "normal",
                isFollowing: item?.is_following,
                totalFollowers: item?.total_followers,
              }}
              key={i}
            />
          ))}
          {data?.data?.length <= 0 && (
            <div className="flex justify-center items-center h-12 w-full">
              No Most Followed Brand Found
            </div>
          )}
        </div>
      )}
    </>
  );
}
