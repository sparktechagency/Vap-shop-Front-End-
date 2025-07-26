/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import BtbProductCard from "@/components/core/btb-product-card";
import {
  useBtbProductsQuery,
  useSendBtbRequestMutation,
} from "@/redux/features/b2b/btbApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Catalog({ id }: { id: string }) {
  const [page, setPage] = React.useState(1);
  const navig = useRouter();
  const {
    data: brandDetails,
    isLoading: isBrandLoading,
    isError,
    error,
  }: any = useBtbProductsQuery({ id });
  const [sendRequest] = useSendBtbRequestMutation();

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
  if (isError) {
    return (
      <div className="">
        <div className="pt-12 pb-6 flex w-full justify-center items-center text-sm font-semibold">
          {error?.data?.message ?? "Something went wrong"}
        </div>
        <div className="flex justify-center">
          <Button
            className=""
            variant={"special"}
            onClick={async () => {
              try {
                const call = await sendRequest({ id }).unwrap();
                if (!call.ok) {
                  toast.error(call.message ?? "Failed to send request");
                } else {
                  toast.success(call.message ?? "Request sent successfully");
                  navig.push(`/stores/store/${id}`);
                }
              } catch (error) {
                console.error(error);
                toast.error("Something went wrong");
              }
            }}
          >
            Send B2B Request
          </Button>
        </div>
      </div>
    );
  }

  if (!brandDetails?.data?.products?.data?.length)
    return <div>Products not found</div>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {brandDetails.data.products.data.map((item: any, i: number) => (
          <BtbProductCard
            key={i}
            data={item}
            link={`/stores/store/product/${item.id}`}
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
