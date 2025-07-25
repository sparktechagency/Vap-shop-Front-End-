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
import type { CartItem } from "./cart-manage";

interface CatalogProps {
  id: string;
  addToCart: (product: any, quantity: number) => void;
  cartItems: CartItem[];
}

export default function Catalog({ id, addToCart, cartItems }: CatalogProps) {
  const [page, setPage] = React.useState(1);
  const navig = useRouter();

  const {
    data: brandDetails,
    isLoading: isBrandLoading,
    isError,
    error,
  }: any = useBtbProductsQuery({ id });

  const [sendRequest] = useSendBtbRequestMutation();

  const totalPages = brandDetails?.meta?.last_page ?? 1;
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

  const handleAddToCart = (product: any, quantity: number) => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} units of ${product.product_name} to cart`);
  };

  const getProductCartQuantity = (productId: number) => {
    const cartItem = cartItems.find((item) => item.product_id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (isBrandLoading)
    return (
      <div className="flex justify-center items-center py-12">Loading...</div>
    );

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
              } catch (error: any) {
                const errMessage =
                  error?.data?.message ||
                  error?.message ||
                  "Something went wrong";
                toast.error(errMessage);
              }
            }}
          >
            Send B2B Request
          </Button>
        </div>
      </div>
    );
  }

  if (!brandDetails?.data?.length)
    return (
      <div className="flex justify-center items-center py-12">
        Products not found
      </div>
    );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-6">
        {brandDetails?.data?.map((item: any) => (
          <BtbProductCard
            key={item.product_id}
            data={item}
            link={`/stores/store/product/${item.product_id}`}
            onAddToCart={handleAddToCart}
            cartQuantity={getProductCartQuantity(item.product_id)}
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
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
