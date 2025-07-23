/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useGetStoreDetailsByIdQuery } from "@/redux/features/store/StoreApi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import BtbProductCard from "@/components/core/btb-product-card";

export default function Catalog({ id }: { id: string }) {
  const [page, setPage] = React.useState(1);
  const per_page = 8;

  const { data: brandDetails, isLoading: isBrandLoading } =
    useGetStoreDetailsByIdQuery({ id, page, per_page });

  const totalPages = brandDetails?.data?.products?.last_page ?? 1;
  const currentPage = page;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isBrandLoading) return <div>Loading...</div>;
  if (!brandDetails?.data?.products?.data?.length)
    return <div>Products not found</div>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {brandDetails.data.products.data.map((item: any, i: number) => (
          <BtbProductCard
            key={i}
            data={{
              id: item.id,
              image: item.product_image || "/image/shop/item.jpg",
              title: item.product_name,
              category: `${item.product_price}`,
              note: item.product_type,
              is_hearted: item.is_hearted,
              hearts: item.total_heart,
            }}
            link={`/stores/store/product/${item.id}`}
            role={5}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-24">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  isActive={currentPage > 1}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  isActive={currentPage < totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
