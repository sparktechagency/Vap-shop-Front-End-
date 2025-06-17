import React from "react";

import { EyeIcon, HeartIcon, StarIcon } from "lucide-react";

import Link from "next/link";

import { BrandType } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "./internal/namer";

export default function BrandProdCard({ data }: { data: BrandType }) {
  return (
    <div className="!p-0 !gap-0 shadow-sm">
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-t-lg relative transition-all"
        style={{ backgroundImage: `url('${data.image}')` }}
      >
        {data.type === "ad" && (
          <div className="absolute top-2 left-2 text-2xl md:text-4xl z-10">
            🔥
          </div>
        )}
        <Link href="/brands/brand">
          <div className="bg-background/70 h-full w-full opacity-0 hover:opacity-60 hover:backdrop-blur-xs transition-all z-0">
            <div className="absolute flex items-center top-1/2 left-1/2 -translate-1/2 text-foreground hover:scale-125 transition-transform cursor-pointer gap-1 text-xs md:text-base">
              <EyeIcon className="size-4 md:size-6" /> View
            </div>
          </div>
        </Link>
        <Button
          className="absolute bottom-2 right-2 bg-background hover:bg-secondary dark:hover:bg-zinc-800 text-foreground"
          variant="default"
          size="icon"
        >
          <HeartIcon className="text-foreground" />
        </Button>
      </div>
      <div className="!p-2 lg:!p-4 !space-y-1 ">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:gap-4 ">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="size-8 lg:size-12 border">
                <AvatarImage src="/image/icon/brand.jpg" />
                <AvatarFallback>
                  {data.storeName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Link href="/brands/brand" className="lg:hidden">
                <Namer type="brand" name="SMOK" isVerified />
              </Link>
            </div>
            <div className="flex-1 w-full">
              <Link href="/brands/brand" className="hidden lg:block">
                <Namer type="brand" name="SMOK" isVerified />
              </Link>
              <div className="flex flex-row justify-start items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                <p>{data.location.city}</p>
              </div>
            </div>
          </div>
          <h3 className="text-sm">
            <div className="flex flex-row items-center gap-2 text-muted-foreground text-sm lg:text-base">
              <StarIcon fill="#ee8500" stroke="" className="size-4 lg:size-5" />{" "}
              {data.rating.value}
              {/* <Link href={"#"} className="text-primary underline">
                ({data.rating.reviews} Reviews)
              </Link> */}
            </div>
          </h3>
        </div>
      </div>
    </div>
  );
}
