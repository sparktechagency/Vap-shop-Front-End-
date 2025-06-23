/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { EyeIcon, HeartIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "./internal/namer";
import { Badge } from "@/components/ui/badge";

export default function BrandProdCard({ data }: { data: any }) {
  return (
    <div className="!p-0 !gap-0 shadow-sm rounded-lg border overflow-hidden">
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover relative transition-all"
        style={{
          backgroundImage: `url('${data.avatar}')`,
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* {data.type === "premium" && (
          <Badge variant="premium" className="absolute top-2 left-2 z-10">00
            Premium
          </Badge>
        )} */}

        <Link href={`/brands/brand/${data.id}`}>
          <div className="bg-background/70 h-full w-full opacity-0 hover:opacity-60 hover:backdrop-blur-xs transition-all z-0">
            <div className="absolute flex items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground hover:scale-125 transition-transform cursor-pointer gap-1 text-xs md:text-base">
              <EyeIcon className="size-4 md:size-6" /> View
            </div>
          </div>
        </Link>

        <Button
          className="absolute bottom-2 right-2 bg-background hover:bg-secondary dark:hover:bg-zinc-800 text-foreground size-8 sm:size-10"
          variant="default"
          size="icon"
        >
          <HeartIcon
            className={`${
              data.is_favourite ? "text-destructive" : "text-foreground"
            } w-4 h-4 sm:w-5 sm:h-5`}
            fill={data.is_favourite ? "#e7000b" : ""}
            stroke={data.is_favourite ? "" : "currentColor"}
          />
        </Button>
      </div>

      <div className="!p-4 space-y-2 bg-white dark:bg-background">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
              <AvatarImage src={data.avatar} />
              <AvatarFallback>
                {data?.full_name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/brands/brand/${data.id}`}>
                <Namer type="brand" name={data.full_name} isVerified={true} />
              </Link>
              <div className="flex items-center gap-2 mt-1">
                {/* <p className="text-xs text-muted-foreground">{data.location.city}</p> */}

                {data.totalFollowers !== undefined && (
                  <div className="text-xs text-muted-foreground">
                    {data.totalFollowers} followers
                  </div>
                )}
                {data.isFollowing && (
                  <Badge variant="outline" className="text-xs py-0.5 px-1.5">
                    Following
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <StarIcon fill="#ee8500" stroke="#ee8500" className="size-4" />
            <span>{data.avg_rating}</span>
            {parseInt(data.avg_rating) > 0 && (
              <Link
                href={`/brands/${data.id}#reviews`}
                className="text-muted-foreground hover:text-primary text-xs"
              >
                ({data.total_reviews})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
