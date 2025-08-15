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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MostFollowers() {
  const [region, setRegion] = useState("");

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

  // Refetch when region changes
  useEffect(() => {
    refetchMostFollowers();
    refetchSponsored();
  }, [region, refetchMostFollowers, refetchSponsored]);

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
      <div className="flex justify-end mt-6">
        {!cLoading && (
          <Select
            value={region === "" ? " " : region}
            onValueChange={(val) => {
              const cleanVal = val.trim() === "" || val === " " ? "" : val;
              setRegion(cleanVal);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Worldwide</SelectItem>
              <SelectSeparator />
              {countries?.data?.map((x: any, i: number) => (
                <React.Fragment key={`country-${x.id}`}>
                  <SelectGroup>
                    <SelectLabel>{x.name}</SelectLabel>
                    {x.regions.map((y: any) => (
                      <SelectItem
                        value={y.id.toString()}
                        key={`region-${y.id}`}
                      >
                        {y.name} ({y.code})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {countries?.data?.length !== i + 1 && <SelectSeparator />}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
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
