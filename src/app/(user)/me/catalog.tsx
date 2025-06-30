/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "@/components/core/product-card";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProductsQuery } from "@/redux/features/manage/product";

export default function Catalog() {
  const { data: catalog, isLoading } = useGetProductsQuery();
  const products = catalog?.data?.data || [];
  console.log(products);

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
        <p className="text-muted-foreground">No products found in catalog</p>
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
            note: `${product.average_rating ?? "0.0"}★ (${
              product.total_heart
            } hearts)`,
            price: product.product_price,
            discount: product.product_discount,
            hearts: product.total_heart,
            rating: product.average_rating,
            reviews: product.hearts_count,
          };

          return (
            <ProductCard
              manage
              key={product.id}
              data={productData}
              link={
                product.role === "5"
                  ? `/stores/store/product/${product.id}`
                  : `/brands/brand/product/${product.id}`
              }
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
                  href={
                    catalog.data.products.prev_page_url
                      ? `?page=${catalog.data.products.current_page - 1}`
                      : "#"
                  }
                  className={
                    !catalog.data.products.prev_page_url
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: catalog.data.products.last_page }).map(
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={`?page=${i + 1}`}
                      isActive={i + 1 === catalog.data.products.current_page}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href={
                    catalog.data.products.next_page_url
                      ? `?page=${catalog.data.products.current_page + 1}`
                      : "#"
                  }
                  className={
                    !catalog.data.products.next_page_url
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
