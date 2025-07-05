/* eslint-disable @typescript-eslint/no-explicit-any */
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
  console.log(res);

  if (!res.ok) {
    return (
      <div className="p-6! py-12! flex justify-center items-center">
        {res?.message}
      </div>
    );
  }

  const datas = res?.data.data;
  console.log('datas-------------------', datas);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {datas?.map((x: any) => (
          <ProductCard
            data={{
              image: x.product_image,
              title: x.product_name,
              category: x.brand_name,
              note: "",
            }}
            link={
              x.role === 5
                ? `/stores/store/product/${x.id}`
                : `/brands/brand/product/${x.id}`
            }
            manage
            key={x.id}
          />
        ))}
      </div>
      <div className="!mt-[100px] hidden">
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
