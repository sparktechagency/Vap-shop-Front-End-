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
import { useGetStoreDetailsByIdQuery } from "@/redux/features/store/StoreApi";

export default function Catalog({ id }: any) {
  const [page, setPage] = React.useState(1);
  const per_page = 2;

  const { data: brandDetails, isLoading: isBrandLoading } = useGetStoreDetailsByIdQuery({ id, page, per_page });

  if (isBrandLoading) return <div>Loading...</div>;

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (brandDetails?.data?.products?.next_page_url) setPage(page + 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPaginationItems = () => {
    if (!brandDetails?.data?.products?.last_page) return null;

    const totalPages = brandDetails.data.products.last_page;
    const currentPage = page;
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is far from start
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
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

  if (!brandDetails?.data?.products?.data) return <div>Products not found</div>;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {brandDetails?.data?.products?.data.map((item: any, i: number) => (
          <ProductCard
            data={{
              image: item.product_image || "/image/shop/item.jpg",
              title: item.product_name,
              category: `${item.product_price}`,
              note: item.product_type
            }}
            link={`/stores/store/product/${item.id}`}
            key={i}
          />
        ))}
      </div>

      {brandDetails?.data?.products?.last_page > 1 && (
        <div className="!mt-[100px]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePrevPage}
                  isActive={page > 1}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={handleNextPage}
                  isActive={!!brandDetails?.data?.products?.next_page_url}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}