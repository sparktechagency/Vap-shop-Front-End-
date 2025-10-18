/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ReviewCard from "@/components/core/review-card";
import { useMostRatedReviewQuery } from "@/redux/features/Trending/TrendingApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountysQuery } from "@/redux/features/AuthApi";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDownIcon, ChevronLeft, Globe } from "lucide-react";

export default function MostRated() {
  const [region, setRegion] = useState(""); // "" means worldwide
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch }: any = useMostRatedReviewQuery({ region });
  const { data: countries, isLoading: cLoading } = useCountysQuery();

  useEffect(() => {
    refetch();
  }, [region, refetch]);

  const handleSelectRegion = (val: string) => {
    setRegion(val);
    setOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <h2 className="text-3xl font-bold text-center!">
        Top Most Rated Reviews
      </h2>

      <div className="flex flex-col md:flex-row justify-end items-center mb-12 gap-4">
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

      {/* Results Section */}
      {isLoading ? (
        <LoadingSkeleton />
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
