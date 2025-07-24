/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ProductCard from "@/components/core/product-card";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetProductsQuery } from "@/redux/features/manage/product";
import { Loader2Icon } from "lucide-react";

export default function Catalog() {
  const [page, setPage] = useState<number>(1);
  const per = 16;
  const { data, isLoading, isError, error } = useGetProductsQuery<any>({
    page,
    per,
  });

  const totalPages = data?.data?.last_page || 1;

  if (isLoading) {
    return (
      <div className="p-6 py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 py-12 flex justify-center items-center">
        {error?.data?.message ?? "Something went wrong."}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {data?.data?.data?.map((x: any) => (
          <ProductCard
            key={x.id}
            data={{
              id: x.id,
              image: x.product_image,
              title: x.product_name,
              category: x.brand_name,
              note: "",
              thc_percentage: x.thc_percentage,
            }}
            link={`/stores/store/product/${x.id}`}
            manage
          />
        ))}
      </div>

      <div className="!mt-[64px]">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={page === pageNum}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
