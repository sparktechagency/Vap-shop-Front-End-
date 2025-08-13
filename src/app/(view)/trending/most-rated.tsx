/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { useCountysQuery } from "@/redux/features/AuthApi";

// Main Component
export default function MostRated() {
  const { data, isLoading, isError, refetch } = useMostRatedReviewQuery();
  const { data: countries, isLoading: cLoading } = useCountysQuery();
  console.log("most rated review", data);

  // Render states
  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-red-500">Error: Couldn&apos;t load reviews.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-12">
        <p>No reviews found for this region.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center">Top Most Rated Reviews</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>

        </div>
        {!cLoading && (
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Worldwide</SelectItem>
              <SelectSeparator />
              {countries?.data?.map((x: any, i: number) => (
                <React.Fragment key={`country-${x.id}`}>
                  <SelectGroup key={`group-${x.id}`}>
                    <SelectLabel>{x.name}</SelectLabel>
                    {x.regions.map((y: any) => (
                      <SelectItem value={y.id} key={`region-${y.id}`}>
                        {y.name}({y.code})
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
    </div>
  );
}

// Skeleton component (no changes needed)
const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8 space-y-6">
    <div className="flex justify-between items-center mb-12">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-48" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-48 w-full rounded-lg" />
    ))}
  </div>
);
