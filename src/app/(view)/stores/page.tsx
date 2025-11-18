/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import StoreProdCard from "@/components/core/store-prod-card";
import LoadingScletion from "@/components/LoadingScletion";
import SliderWithSkeleton from "@/components/SliderWithSkeleton";
import { Button } from "@/components/ui/button";
import { BrandType } from "@/lib/types/product";
import { useGetAllstoreQuery } from "@/redux/features/store/StoreApi";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { useCountysQuery } from "@/redux/features/AuthApi";
import { useGoogleLocation } from "@/hooks/useCurrentLocation";
export default function Page() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetAllstoreQuery({ page });
  const [region, setRegion] = useState("");
  const { data: countries, isLoading: countriesLoading } = useCountysQuery();
  const { location, loading } = useGoogleLocation();
  console.log("location data--------------------> ", location);
  if (isLoading || loading) {
    return <LoadingScletion />;
  }

  const stores = data?.data?.data || [];
  const pagination = {
    current_page: data?.data?.current_page || 1,
    last_page: data?.data?.last_page || 1,
    total: data?.data?.total || 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="!my-12">
      <SliderWithSkeleton />
      <div className="!px-4 lg:!px-[7%] !mt-12">
        <h3 className="text-xl md:text-4xl font-semibold">Stores</h3>
        <div className="w-full flex justify-end items-center gap-4">
          <Button variant="link" asChild>
            <Link href="/map">
              <ArrowLeftIcon /> Map View
            </Link>
          </Button>
          <Select
            onValueChange={(val) => {
              // Treat blank or whitespace as worldwide = ""
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
              {!countriesLoading &&
                countries?.data?.map((country: any, i: number) => (
                  <React.Fragment key={`country-${country.id}`}>
                    <SelectGroup key={`group-${country.id}`}>
                      <SelectLabel>{country.name}</SelectLabel>
                      {country.regions.map((region: any) => (
                        <SelectItem
                          value={region.id.toString()}
                          key={`region-${region.id}`}
                        >
                          {region.name} ({region.code})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    {countries?.data?.length !== i + 1 && <SelectSeparator />}
                  </React.Fragment>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
          {stores?.length > 0 ? (
            stores?.map((store: any) => {
              const storeData: BrandType = {
                id: store.id.toString(),
                is_favourite: store.is_favourite,
                image: store.cover_photo || "/image/shop/item.jpg",
                avatar: store.avatar || "/image/shop/item.jpg",
                storeName: store.full_name,
                isVerified: true,
                location: {
                  city: store.address?.address || "Unknown",
                  distance: store.address?.zip_code || "",
                },
                rating: {
                  value: store.avg_rating || 0,
                  reviews: store.total_reviews || 0,
                },
                isOpen: !store.is_banned,
                closingTime: "",
                type: "normal",
              };

              return (
                <StoreProdCard
                  refetch={refetch}
                  key={store.id}
                  data={storeData}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No stores found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="!mt-[100px]">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, pagination.last_page) }).map(
                  (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={pageNumber === page}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                {pagination.last_page > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(pagination.last_page, page + 1))
                    }
                    className={
                      page === pagination.last_page
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
