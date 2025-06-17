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
export default function MostFollowers() {
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
        {Array.from({ length: 8 }).map((_, i) => (
          <BrandProdCard data={mockData} key={i} />
        ))}
      </div>
      <h2 className="font-semibold text-2xl !mt-12">
        Top 50 Most Followed Brands
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {Array.from({ length: 50 }).map((_, i) => (
          <BrandProdCard data={mockData} key={i} />
        ))}
      </div>
      <div className="!mt-[100px]">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
