/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "@/components/core/product-card";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyMostHeartedQuery } from "@/redux/features/users/userApi";
import { useUser } from "@/context/userContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function Catalog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(currentPage);

  const { data: catalog, isLoading } = useGetMyMostHeartedQuery({
    per: 16,
    page: page,
  });

  const products = catalog?.data?.data || [];
  const { role } = useUser();

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNum: number) => {
    router.push(`?page=${pageNum}`);
  };

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
            category: product.category_name ? product.category_name : null,
            note: `${product.average_rating ?? "0.0"}★ (${product.total_heart
              } hearts)`,
            price: product.product_price,
            discount: product.product_discount,
            hearts: product.total_heart,
            rating: product.average_rating,
            reviews: product.hearts_count,
          };

          return (
            <ProductCard
              key={product.id}
              data={productData}
              role={parseInt(role)}
              link={
                String(role) === "5"
                  ? `/stores/store/product/${product.id}`
                  : `/brands/brand/product/${product.id}`
              }
            />
          );
        })}
      </div>

      {catalog?.data?.links && (
        <div className="!mt-[100px]">
          <Pagination>
            <PaginationContent>
              {catalog.data.links.map((link: any, index: number) => {
                const isPrevious = link.label.includes("Previous");
                const isNext = link.label.includes("Next");

                if (isPrevious) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (link.url) handlePageChange(page - 1);
                        }}
                        className={
                          !link.url ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                  );
                }

                if (isNext) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (link.url) handlePageChange(page + 1);
                        }}
                        className={
                          !link.url ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={link.active}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(parseInt(link.label));
                      }}
                    >
                      {link.label}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
