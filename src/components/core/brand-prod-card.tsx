"use client";
import React from "react";
import { EyeIcon, HeartIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { BrandType } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "./internal/namer";
import { Badge } from "@/components/ui/badge";

export default function BrandProdCard({ data }: { data: BrandType }) {
  return (
    <div className="!p-0 !gap-0 shadow-sm rounded-lg border overflow-hidden">
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover relative transition-all"
        style={{
          backgroundImage: `url('${data?.image}')`,
          backgroundColor: "#f5f5f5",
        }}
      >
        {data?.type === "ad" && (
          <div className="absolute top-4 left-4 text-2xl md:text-4xl">🔥</div>
        )}

        <Link href={`/brands/brand/${data?.id}?${data?.storeName?.toLocaleLowerCase()}`}>
          <div className="bg-background/70 h-full w-full opacity-0 hover:opacity-60 hover:backdrop-blur-xs transition-all z-0">
            <div className="absolute flex items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground hover:scale-125 transition-transform cursor-pointer gap-1 text-xs md:text-base">
              <EyeIcon className="size-4 md:size-6" /> View
            </div>
          </div>
        </Link>

        <Button
          className="absolute bottom-2 right-2 bg-background hover:bg-secondary dark:hover:bg-zinc-800 text-foreground"
          variant="default"
          size="icon"
        >
          <HeartIcon
            className={`text-foreground ${data?.isFollowing ? "fill-foreground" : ""
              }`}
          />
        </Button>
      </div>

      <div className="!p-4 space-y-2 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
              <AvatarImage src={data?.image} />
              <AvatarFallback>
                {data?.storeName}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/brands/brand/${data?.id}`}>
                <Namer
                  type="brand"
                  name={data?.storeName}
                  isVerified={data?.isVerified}
                />
              </Link>
              <div className="flex items-center gap-2 mt-1">
                {/* <p className="text-xs text-muted-foreground">{data?.location.city}</p> */}

                {data?.totalFollowers !== undefined && (
                  <div className="text-xs text-muted-foreground">
                    {data?.totalFollowers} followers
                  </div>
                )}
                {data?.isFollowing && (
                  <Badge variant="outline" className="text-xs py-0.5 px-1.5">
                    Following
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <StarIcon fill="#ee8500" stroke="#ee8500" className="size-4" />
            <span>{data?.rating.value}</span>
            {data?.rating.reviews > 0 && (
              <Link
                href={`/brands/${data?.id}#reviews`}
                className="text-muted-foreground hover:text-primary text-xs"
              >
                ({data?.rating.reviews})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
