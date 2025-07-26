/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductType } from "@/lib/types/product";
import { Button } from "../ui/button";
import { ArrowUp01Icon, PackagePlus } from "lucide-react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { useDeleteProdMutation } from "@/redux/features/manage/product";

import { useState } from "react";
export default function BtbProductCard({
  show,
  data,
  link,
}: {
  show?: boolean;
  data: any;
  link?: string;
}) {
  const [copied, setCopied] = useState(false);
  const currentUrl = `${
    window.location.origin ?? "https://vapeshopmaps.com/"
  }/stores/store/product/${data.id}`;
  const [deleteProd, { isLoading }] = useDeleteProdMutation();
  console.log(data);

  return (
    <Card className="!p-0 !gap-0 shadow-sm overflow-hidden group relative">
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-t-lg relative transition-transform duration-300"
        style={{ backgroundImage: `url('${data.product_image}')` }}
      >
        {!show && (
          <div className="absolute bottom-2 right-2 flex z-50">
            <div className="rounded-full bg-background border border-black">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"ghost"} className="rounded-full gap-4">
                    <ArrowUp01Icon />
                    <PackagePlus />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="px-2!">
                  <CardHeader className="px-2!">
                    <CardTitle>Add More</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full grid grid-cols-3 gap-2 px-2! mt-3">
                    <Button className="flex-col h-auto!">
                      <span>+25</span>
                      <span>($409)</span>
                    </Button>
                    <Button className="flex-col h-auto!">
                      <span>+50</span>
                      <span>($1018)</span>
                    </Button>
                    <Button className="flex-col h-auto!">
                      <span>+100</span>
                      <span>($2026)</span>
                    </Button>
                  </CardContent>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Content - click to navigate */}
      <Link href={link ? link : "#"}>
        <div className="cursor-pointer">
          <CardContent className="!p-4 !space-y-1 transition-colors hover:text-primary">
            <h3 className="lg:text-base font-semibold text-xs md:text-sm">
              {data.product_name}
            </h3>
            <div className="text-xs md:text-sm text-muted-foreground flex justify-between items-center">
              <p>${data.b2b_details.wholesale_price}</p>
              <p>Min: {data.b2b_details.moq}</p>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
