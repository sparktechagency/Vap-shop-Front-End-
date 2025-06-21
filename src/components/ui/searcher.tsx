/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPinIcon, SearchIcon, StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Namer from "../core/internal/namer";
import Dotter from "../ui/dotter";
import { useGetCountriesQuery } from "@/redux/features/others/otherApi";

const categories = ["shops", "brands", "products", "accounts", "everything"];

const getImageSrc = (category: string) => {
  switch (category) {
    case "shops":
      return "/image/icon/store.png";
    case "brands":
      return "/image/icon/brand.jpg";
    case "products":
      return "/image/shop/item.jpg";
    case "accounts":
    default:
      return "/image/icon/user.jpeg";
  }
};

export default function Searcher({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [searchFocus, setSearchFocus] = useState(false);
  const [locationFocus, setLocationFocus] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const [selectedSearch, setSelectedSearch] = useState("shops");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: locations } = useGetCountriesQuery();

  useEffect(() => {
    if (locations) {
      console.log(locations.data);
    }
  }, [locations]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocus(false);
        setLocationFocus(false);
      }
    };

    if (searchFocus || locationFocus) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchFocus, locationFocus]);

  const filteredRegions = locations?.data
    ?.flatMap((country: { regions: any[]; name: any }) =>
      country.regions.map((region) => ({
        id: region.id,
        name: region.name,
        code: region.code,
        countryName: country.name,
      }))
    )
    ?.filter((region: { name: string; code: string; countryName: string }) => {
      const query = locationInput.toLowerCase();
      return (
        region.name.toLowerCase().includes(query) ||
        region.code.toLowerCase().includes(query) ||
        region.countryName.toLowerCase().includes(query)
      );
    })
    ?.slice(0, 8);

  return (
    <div className={className} {...props} ref={searchContainerRef}>
      <div className="h-[calc(48px-8px)] w-full border rounded-md flex justify-between items-center relative overflow-visible">
        <div className="!size-10 flex items-center !pl-2 md:!pl-4">
          <SearchIcon className="size-4 md:size-5 text-zinc-500" />
        </div>
        <Input
          className="border-none outline-none !ring-0 !px-2 md:!px-4 !bg-background text-xs md:text-base"
          placeholder="Products, retailers & brands"
          onFocus={() => setSearchFocus(true)}
        />
        <div className="w-[1px] h-1/2 bg-zinc-300" />
        <div className="w-1/2 sm:w-1/3 h-full md:!space-x-2 flex items-center !pl-2 md:!pl-4 text-zinc-500 relative">
          <MapPinIcon className="size-4 md:size-5" />
          <Input
            className="border-none outline-none !ring-0 !bg-background text-xs text-foreground! md:text-base !pl-1 sm:!pl-2"
            placeholder="California, PA"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </div>

        <AnimatePresence>
          {searchFocus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[calc(148px/3)] left-0 w-full bg-background border shadow-lg h-[40vh] rounded-lg grid grid-cols-4 z-10  p-4!"
            >
              <div className="col-span-2 w-full h-full space-y-4 overflow-auto overflow-x-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[100px] w-full rounded p-2! flex gap-2"
                  >
                    <Card className="aspect-square rounded p-1!">
                      <Image
                        src={getImageSrc(selectedSearch)}
                        height={124}
                        width={124}
                        className="h-full w-full object-cover rounded animate-in"
                        alt="icon"
                      />
                    </Card>
                    <div className="flex-1 flex flex-col justify-between">
                      <Namer
                        name="Vape Juice Deport"
                        type="store"
                        isVerified
                        size="sm"
                      />
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <StarIcon
                          fill="#ee8500"
                          stroke=""
                          className="w-4 h-4"
                        />
                        4.9
                      </div>
                      <div className="flex gap-2 text-xs! text-muted-foreground items-center">
                        <p className="truncate">BROOKLYN, New York</p>
                        <Dotter />
                        <div className="whitespace-nowrap">4 mi</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-around items-center text-xs sm:text-sm md:text-base lg:text-lg">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="link"
                    className={cn(
                      selectedSearch === cat && "font-black underline"
                    )}
                    onClick={() => setSelectedSearch(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="w-full bg-background border shadow-lg rounded-lg z-10 p-4! overflow-y-auto overflow-x-hidden!">
                {filteredRegions?.length ? (
                  filteredRegions.map(
                    (region: {
                      id: string;
                      name: string;
                      code: string;
                      countryName: string;
                    }) => (
                      <Button
                        key={region.id}
                        className="text-xs! text-muted-foreground hover:bg-accent p-2! rounded cursor-pointer"
                        variant="ghost"
                        onClick={() => {
                          setLocationInput(region.name);
                          // loca;
                        }}
                      >
                        {region.name} ({region.code}), {region.countryName}
                      </Button>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground italic p-2!">
                    No results
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
