/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
import ReviewCard from "@/components/core/review-card";
import { useMostRatedReviewQuery } from "@/redux/features/Trending/TrendingApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountysQuery } from "@/redux/features/AuthApi";

export default function MostRated() {
  const [region, setRegion] = useState(""); // "" means worldwide

  const { data, isLoading, isError, refetch, error }: any =
    useMostRatedReviewQuery({
      region,
    });

  const { data: countries, isLoading: cLoading } = useCountysQuery();

  useEffect(() => {
    refetch();
  }, [region, refetch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section - Always visible */}
      <h2 className="text-3xl font-bold text-center!">
        Top Most Rated Reviews
      </h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className=""></div>
        {!cLoading && (
          <Select
            onValueChange={(val) => {
              const cleanVal = val.trim() === "" || val === " " ? "" : val;
              setRegion(cleanVal);
            }}
            value={region === "" ? " " : region}
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

      {/* Results Section */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-red-500">
            {error?.data?.message || "Error: Couldn’t load reviews."}
          </p>
        </div>
      ) : data?.data?.length ? (
        <div className="space-y-6">
          {data?.data?.map((review: any) => (
            <ReviewCard
              role={review?.manage_products?.role || 0}
              refetch={refetch}
              key={review?.id}
              data={review}
              productData={{
                id: review?.manage_product_id,
                product_image:
                  review?.manage_products?.product_image || "/placeholder.svg",
                product_name:
                  review?.manage_products?.product_name || "Unknown Product",
                category: review?.manage_products?.category,
                average_rating:
                  review?.manage_products?.average_rating?.toString() || "0",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>No reviews found for this region.</p>
        </div>
      )}
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-48 w-full rounded-lg" />
    ))}
  </div>
);
