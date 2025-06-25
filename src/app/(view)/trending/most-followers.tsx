
'use client';
import BrandProdCard from "@/components/core/brand-prod-card";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BrandType } from "@/lib/types/product";
import { useGetmostFollowrsBrandQuery, useGetSponsoredBrandsQuery } from "@/redux/features/Trending/TrendingApi";
import { Skeleton } from "@/components/ui/skeleton";
export default function MostFollowers() {

  const { data, isLoading } = useGetmostFollowrsBrandQuery();
  const { data: sponsored, isLoading: sponsoredLoading } = useGetSponsoredBrandsQuery();
  console.log('sponsored', sponsored);





  if (isLoading || sponsoredLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    )
  }



  const mockData: BrandType = {
    id: "1",
    image: "/image/shop/brand.webp",
    type: "ad",
    storeName: "Vape Juice Deport",
    isVerified: true,
    location: {
      city: "BROOKLYN, New York",
      distance: "4 mi",
    },
    rating: {
      value: 4.9,
      reviews: 166,
    },
    isOpen: true,
    closingTime: "10 PM",
  };
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {sponsored?.data.map((item: any, i: number) => (
          <BrandProdCard data={
            {
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
              totalFollowers: item?.total_followers
            }
          } key={i} />
        ))}
      </div>
      <h2 className="font-semibold text-2xl !mt-12">
        Top 50 Most Followed Brands
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {data?.data?.map((item: any, i: number) => (
          <BrandProdCard data={
            {
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
              totalFollowers: item?.total_followers
            }
          } key={i} />
        ))}
      </div>

    </>
  );
}
