'use client';

import ProductCard from "@/components/core/product-card";
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
import Link from "next/link";
import { useGetMostHurtedBrandQuery } from "@/redux/features/brand/brandApis";
import { Skeleton } from "@/components/ui/skeleton";

export default function MostHearted({ id }: any) {
  const { data: brandData, isLoading, refetch } = useGetMostHurtedBrandQuery(id as any);
  const products = brandData?.data?.products?.data || [];
  console.log('brandData', brandData);
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {products.map((product: any) => {
          const productData = {
            image: product.product_image || "/image/shop/item.jpg",
            title: product.product_name,
            category: `$${product.product_price}`,
            note: `${product.average_rating}★ (${product.total_heart} hearts)`,
            hearts: product.total_heart,
            is_hearted: product.is_hearted,
            id: product.id,
            slug: product.slug
          };

          return (
            <ProductCard
              role={3}
              refetch={refetch}
              key={product.id}
              data={productData}
              link={`/brands/brand/product/${product.id}`}
            />
          );
        })}
      </div>


    </>
  );
}