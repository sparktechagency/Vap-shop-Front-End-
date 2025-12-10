"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useGetBrandDetailsByIdQuery } from "@/redux/features/brand/brandApis";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";

export default function Catalog({ id }: any) {
  const [page, setPage] = useState(1);
  const handlePageChange = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };
  const { data: me } = useGetOwnprofileQuery();
  const {
    data: catalog,
    isLoading,
    isError,
    error,
  } = useGetBrandDetailsByIdQuery({ id, page });

  const products = catalog?.data?.products?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  if (isError) {
    <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
      <code className="whitespace-pre-wrap">
        {JSON.stringify(error, null, 2)}
      </code>
    </pre>;
  }
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found in catalog</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {products.map((product: any) => {
          const productData = {
            id: product.id,
            image: product.product_image || "/image/shop/item.jpg",
            title: product.product_name,
            category: product.category_name ? product.category_name : null,
            note: `${product.average_rating}★ (${product.total_heart} hearts)`,
            // price: product.product_price,
            discount: product.product_discount,
            hearts: product.total_heart,
            is_hearted: product.is_hearted,
            rating: product.average_rating,
            reviews: product.hearts_count,
          };

          return (
            <ProductCard
              key={product.id}
              data={productData}
              link={`/brands/brand/product/${product.id}`}
              role={3}
              manage={me?.data?.role === 1}
              admin
            />
          );
        })}
      </div>

      {catalog?.data?.products?.last_page > 1 && (
        <div className="!mt-[100px]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: catalog.data.products.last_page }).map(
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={i + 1 === page}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page === catalog.data.products.last_page
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
