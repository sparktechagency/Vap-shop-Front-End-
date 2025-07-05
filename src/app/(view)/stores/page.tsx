'use client';

import StoreProdCard from "@/components/core/store-prod-card";
import LoadingScletion from "@/components/LoadingScletion";
import ProductCarousel from "@/components/product-carousel";
import SliderWithSkeleton from "@/components/SliderWithSkeleton";
import { Button } from "@/components/ui/button";
import { BrandType, ProductType } from "@/lib/types/product";
import { useGetAllstoreQuery } from "@/redux/features/store/StoreApi";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";



export default function Page() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const { data, isLoading } = useGetAllstoreQuery({ page, per_page: perPage });

  if (isLoading) {
    return <LoadingScletion />;
  }

  const products = data?.data || [];
  const pagination = data || {};
  console.log('storeproducts', products);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="!my-12">
      <SliderWithSkeleton />
      <div className="!px-4 lg:!px-[7%] !mt-12">
        <h3 className="text-xl md:text-4xl font-semibold">Stores</h3>
        <div className="w-full flex justify-end items-center">
          <Button variant="link" asChild>
            <Link href="/map">
              <ArrowLeftIcon /> Map View
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
          {products?.data?.length > 0 ? (
            products?.data?.map((product: any) => {
              const productData: BrandType = {
                id: product.id.toString(),
                image: product.product_image || "/image/shop/item.jpg",
                avatar: product?.user?.avatar || "/image/shop/item.jpg",
                storeName: product.product_name,
                isVerified: true,
                location: {
                  city: product.category?.name || "Product",
                  distance: `$${product.product_price}`,
                },
                rating: {
                  value: parseFloat(product.average_rating) || 0,
                  reviews: product.total_heart || 0,
                },
                isOpen: true,
                closingTime: "",
                type: "normal",
              };

              return (
                <StoreProdCard
                  key={product.id}
                  data={productData}

                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No products found</p>
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
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, i) => {
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
                })}

                {pagination.last_page > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(pagination.last_page, page + 1))}
                    className={page === pagination.last_page ? "pointer-events-none opacity-50" : ""}
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