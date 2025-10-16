"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, StarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

import { useSearchQuery } from "@/redux/features/others/otherApi";
import Namer from "@/components/core/internal/namer";

export default function AddLocation() {
  const [searchInput, setSearchInput] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // only searching for stores
  const { data: searching } = useSearchQuery({
    search: searchInput,
    type: "store",
    region: "",
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocus(false);
      }
    };
    if (searchFocus) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchFocus]);

  const getHref = (x: any) => `/stores/store/${x.id}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add a new Location</Button>
      </DialogTrigger>

      <DialogContent className="min-w-[60dvw]" ref={searchContainerRef}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Search for a Store</DialogTitle>
        </DialogHeader>

        <div className="my-4">
          <InputGroup>
            <InputGroupInput
              placeholder="Search stores..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocus(true)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {searchFocus && (
          <div className="max-h-[50vh] overflow-auto mt-4 space-y-2">
            {searching?.data?.data?.length ? (
              searching.data.data.map((x: any, i: number) => (
                <Link href={getHref(x)} key={i}>
                  <div className="flex gap-2 p-2 hover:bg-secondary rounded">
                    <Card className="aspect-square w-[80px] flex-shrink-0 p-0!">
                      <Image
                        src={x.avatar}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                        alt="store avatar"
                      />
                    </Card>

                    <div className="flex-1 flex flex-col justify-between">
                      <Namer name={x.first_name} type="store" size="sm" />
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <StarIcon className="w-4 h-4 fill-[#ee8500]" />
                        {x.avg_rating}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {x?.address?.address}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Search for a store...
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
