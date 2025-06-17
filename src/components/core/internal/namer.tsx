"use client";
import { Roles } from "@/lib/types/extras";
import {
  BookOpenIcon,
  Loader2Icon,
  StarIcon,
  StoreIcon,
  WarehouseIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Namer({
  name,
  isVerified,
  type,
  size,
}: {
  name: string;
  isVerified?: boolean;
  type: Roles;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Loader2Icon className="animate-spin" />
      </>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <h3
        className={`font-extrabold ${
          size === "sm"
            ? "text-xs md:text-sm"
            : size === "md"
            ? "text-xs md:text-base"
            : size === "lg"
            ? "text-sm md:text-lg"
            : size === "xl"
            ? "text-sm md:text-xl"
            : "text-xs md:text-base"
        }`}
      >
        {name}
      </h3>

      <div className="">
        {type === "member" ? (
          <Image
            src={`https://img.icons8.com/external-dreamcreateicons-mixed-dreamcreateicons/64/${
              resolvedTheme === "dark" ? "ffffff" : "191919"
            }/external-smoking-men-lifestyle-dreamcreateicons-mixed-dreamcreateicons.png`}
            height="48"
            width="48"
            className="size-3 md:size-5"
            alt="verified-icon"
          />
        ) : type === "brand" ? (
          <BookOpenIcon className="size-3 md:size-5" />
        ) : type === "store" ? (
          <StoreIcon className="size-3 md:size-5" />
        ) : type === "association" ? (
          <WarehouseIcon className="size-3 md:size-5" />
        ) : type === "wholesaler" ? (
          <StarIcon className="size-3 md:size-5" />
        ) : (
          <div className="">
            <Image
              src="/image/icon/verified.svg"
              height="48"
              width="48"
              className="size-3 md:size-5"
              alt="verified-icon"
            />
          </div>
        )}
      </div>
      {isVerified && (
        <div className="">
          <Image
            src="/image/icon/verified.svg"
            height="48"
            width="48"
            className="size-3 sm:size-6"
            alt="verified-icon"
          />
        </div>
      )}
    </div>
  );
}
