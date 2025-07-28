/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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

// Define interfaces for strong typing
interface Product {
  product_image: string;
  product_name: string;
  role?: number;
  category?: { name: string; id: number };
  average_rating?: string;
}

interface Review {
  id: number;
  manage_product_id: number;
  manage_products: Product;
  // Add other review properties here e.g., comment: string, rating: number
}

// Main Component
export default function MostRated() {
  const [region, setRegion] = useState("uni"); // Default filter
  const { data, isLoading, isError, refetch } = useMostRatedReviewQuery();

  console.log("most rated review", data);

  // Render states
  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-red-500">Error: Couldn't load reviews.</p>
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h2 className="text-3xl font-bold">Top Most Rated Reviews</h2>
        <Select value={region} onValueChange={setRegion}>
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
            // FIX: Rename 'productData' to 'product'
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