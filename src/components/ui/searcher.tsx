"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPinIcon, SearchIcon, StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import Image from "next/image";
import Namer from "../core/internal/namer";
import Dotter from "./dotter";
export default function Searcher({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [selectedSearch, setSelectedSearch] = useState<string>("shops");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocus(false);
      }
    }

    // Add event listener when dropdown is open
    if (searchFocus) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchFocus]);

  return (
    <div className={className} {...props} ref={searchContainerRef}>
      <div className="h-[calc(48px-8px)] w-full border rounded-md flex flex-row justify-between items-center relative">
        <div className="!size-10 flex justify-center items-center !pl-2 md:!pl-4">
          <div className="">
            <SearchIcon className="size-4 md:size-5 text-zinc-500" />
          </div>
        </div>
        <Input
          className="border-none outline-none !ring-0 !px-2 md:!px-4 !bg-background text-xs md:text-base"
          placeholder="Products, retailers & brands"
          onFocus={() => setSearchFocus(true)}
          // Remove the onBlur handler
        />
        <div className="w-[1px] h-1/2 bg-zinc-300"></div>
        <div className="w-1/2 sm:w-1/3 h-full md:!space-x-2 flex flex-row justify-start items-center !pl-2 md:!pl-4 text-zinc-500">
          <MapPinIcon className="size-4 md:size-5" />
          <Input
            className="border-none outline-none !ring-0 !bg-background text-xs md:text-base !pl-1 sm:!pl-2"
            placeholder="California, PA"
            onFocus={() => {
              setSearchFocus(false);
            }}
          />
        </div>
        <AnimatePresence>
          {searchFocus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`absolute top-[calc(148px/3)] left-0 w-full bg-background border shadow-lg h-[40vh] rounded-lg grid grid-cols-4 divide-x !p-4 z-10`}
            >
              <div className="col-span-3 w-full h-full !pr-4 !space-y-4 overflow-auto overflow-x-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[100px] w-full border rounded p-2! flex flex-row gap-2!"
                  >
                    <Card className="aspect-square rounded !p-1">
                      <Image
                        src={
                          selectedSearch === "shops"
                            ? "/image/icon/store.png"
                            : selectedSearch === "brands"
                            ? "/image/icon/brand.jpg"
                            : selectedSearch === "products"
                            ? "/image/shop/item.jpg"
                            : "/image/icon/user.jpeg"
                        }
                        height={124}
                        width={124}
                        className="h-full w-full object-cover rounded animate-in"
                        alt="icon"
                      />
                    </Card>
                    <div className="flex-1 h-full flex flex-col justify-between items-baseline">
                      <Namer
                        name="Vape Juice Deport"
                        type="store"
                        isVerified
                        size="sm"
                      />
                      <div className="flex flex-row items-center gap-1 sm:gap-2 text-muted-foreground">
                        <StarIcon
                          fill="#ee8500"
                          stroke=""
                          className="w-4 h-4"
                        />{" "}
                        {4.9}
                      </div>
                      <div className="flex flex-row justify-start items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <p className="truncate">BROOKLYN, New York</p>
                        <Dotter />
                        <div className="whitespace-nowrap">4 mi</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-around items-center text-xs sm:text-sm md:text-base lg:text-lg">
                <Button
                  variant="link"
                  className={cn(
                    selectedSearch === "shops" && "font-black underline"
                  )}
                  onClick={() => {
                    setSelectedSearch("shops");
                  }}
                >
                  Shops
                </Button>
                <Button
                  variant="link"
                  className={cn(
                    selectedSearch === "brands" && "font-black underline"
                  )}
                  onClick={() => {
                    setSelectedSearch("brands");
                  }}
                >
                  Brands
                </Button>
                <Button
                  variant="link"
                  className={cn(
                    selectedSearch === "products" && "font-black underline"
                  )}
                  onClick={() => {
                    setSelectedSearch("products");
                  }}
                >
                  Products
                </Button>
                <Button
                  variant="link"
                  className={cn(
                    selectedSearch === "accounts" && "font-black underline"
                  )}
                  onClick={() => {
                    setSelectedSearch("accounts");
                  }}
                >
                  Accounts
                </Button>
                <Button
                  variant="link"
                  className={cn(
                    selectedSearch === "everything" && "font-black underline"
                  )}
                  onClick={() => {
                    setSelectedSearch("everything");
                  }}
                >
                  Everything
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
