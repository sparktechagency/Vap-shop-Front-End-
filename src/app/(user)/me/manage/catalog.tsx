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
import howl from "@/lib/howl";
import { cookies } from "next/headers";

export default async function Catalog() {
  const token = (await cookies()).get("token")?.value;
  const res = await howl({ link: "product-manage", token });

  if (!res.ok) {
    return (
      <div className="p-6! py-12! flex justify-center items-center">
        {res?.message}
      </div>
    );
  }

  const datas = res?.data;
  console.log(datas);

  const data = {
    image: "/image/shop/item.jpg",
    title: "Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)",
    category: "PODS",
    note: "93.1% THC",
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCard data={data} manage key={i} />
        ))}
      </div>
      <div className="!mt-[100px]">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
