/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { useGetWholesalerProdByIdQuery } from "@/redux/features/Trending/TrendingApi";

export default function Catalog({ id, role }: any) {
  console.log("id", id);

  const [page, setPage] = React.useState(1);
  const per_page = 12;

  const {
    data: brandDetails,
    isLoading: isBrandLoading,
    isError,
    error,
    refetch,
  } = useGetWholesalerProdByIdQuery({ id, per_page, page });


  console.log('brandDetails', brandDetails);


  if (!isBrandLoading) {
    console.log(brandDetails);
  }
  if (isError) {
    console.log(error);
  }
  const totalPages = brandDetails?.products?.last_page || 1;
  const products =
    brandDetails?.products?.data || brandDetails?.data?.products?.data || [];

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPaginationItems = () => {
    if (totalPages <= 1) return null;

    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={page === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis if current page is far from start
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Pages around current
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if current page is far from end
    if (page < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isBrandLoading)
    return <div className="py-12 text-center">Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {products.map((item: any) => (
          <ProductCard
            key={item.id}
            data={{
              id: item.id,
              image: item.product_image || "/image/shop/item.jpg",
              title: item.product_name,
              category: item.category_name ? item.category_name : null,
              price: role === 4 ? null : item.product_price,
              note: item.product_type,
              is_hearted: item.is_hearted,
              hearts: item.total_heart,
            }}
            link={`/profile/product/${item.id}`}
            refetch={refetch}
            role={4}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-[100px]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrevPage} />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
