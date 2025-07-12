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

export default function MostRated() {
  const { data, isLoading, isError, refetch } = useMostRatedReviewQuery();

  console.log("most rated review", data);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <p>can&apos;t loading reviews</p>;
  if (!data?.data?.length) return <p>No reviews found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h2 className="text-3xl font-bold">Top Most Rated Reviews</h2>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uni">Worldwide</SelectItem>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Canada</SelectLabel>
              <SelectItem value="on">Ontario</SelectItem>
              <SelectItem value="br">British Columbia</SelectItem>
              <SelectItem value="al">Alberta</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>United States</SelectLabel>
              <SelectItem value="tn">Tennessee (TN)</SelectItem>
              <SelectItem value="ga">Georgia (GA)</SelectItem>
              <SelectItem value="tx">Texas (TX)</SelectItem>
              <SelectItem value="fl">Florida (FL)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
