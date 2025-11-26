"use client";
import React from "react";
import { EyeIcon, HeartIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { BrandType } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Dotter from "@/components/ui/dotter";
import Namer from "./internal/namer";
import { useFevoritestoreMutation } from "@/redux/features/store/StoreApi";
import { toast } from "sonner";

interface StoreProdCardProps {
  data: BrandType;
  refetch?: () => void;
}

export default function StoreProdCard({ data, refetch }: StoreProdCardProps) {
  const [fevoritestore, { isLoading }] = useFevoritestoreMutation();

  const handleFavorite = async (id: string) => {
    try {
      const response = await fevoritestore({ favourite_id: id }).unwrap();
      toast.success(response.message || "Favorite status updated");
      refetch?.(); // Only call refetch if it exists
    } catch (error) {
      console.error("Favorite error:", error);
      toast.error("Failed to update favorite status");
    }
  };

  return (
    <div className="w-full shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover relative group"
        style={{ backgroundImage: `url('${data.image}')` }}
      >
        {/* Ad Badge */}
        {data.type === "ad" && (
          <div className="absolute top-2 left-2 text-3xl sm:text-4xl z-10">
            🔥
          </div>
        )}

        {/* View Overlay */}
        <Link
          href={`/stores/store/${data.id}?${data?.storeName.toLowerCase()}`}
          className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 group-hover:opacity-60 backdrop-blur-sm transition-opacity"
          aria-label={`View ${data.storeName} store`}
        >
          <div className="flex items-center gap-1.5 text-foreground text-sm sm:text-base">
            <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View</span>
          </div>
        </Link>

        {/* Favorite Button */}
        <Button
          className="absolute bottom-2 right-2 bg-background hover:bg-secondary dark:hover:bg-zinc-800 text-foreground size-8 sm:size-10 p-0"
          variant="default"
          size="icon"
          onClick={() => handleFavorite(data.id)}
          disabled={isLoading}
          aria-label={
            data.is_favourite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <HeartIcon
            fill={data.is_favourite ? "#e7000b" : "transparent"}
            className="text-foreground w-4 h-4 sm:w-5 sm:h-5"
            stroke={data.is_favourite ? "#e7000b" : "currentColor"}
          />
        </Button>
      </div>

      {/* Store Info Section */}
      <div className="p-3 sm:p-4 space-y-2">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 sm:size-12 border">
            <AvatarImage src={data.avatar} alt={data.storeName} />
            <AvatarFallback>
              {data.storeName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <Link
              href={`/stores/store/${data.id}?${data?.storeName.toLowerCase()}`}
              className="block truncate hover:text-primary transition-colors"
            >
              <Namer type="store" name={data.storeName} isVerified />
            </Link>

            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <p className="truncate">{data.location.city}</p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <StarIcon fill="#ee8500" stroke="none" className="w-4 h-4" />
          <span>{data.rating.value}</span>
          <Link
            href={`/stores/store/${
              data.id
            }?${data?.storeName.toLowerCase()}#reviews`}
            className="text-primary underline hover:text-primary/80 transition-colors"
          >
            ({data.rating.reviews} Reviews)
          </Link>
        </div>

        {/* Opening Status */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className={data.isOpen ? "text-green-600" : "text-red-600"}>
            {data.isOpen ? "Open Now" : "Closed"}
          </span>
          <Dotter />
          <span>Closes at {data.closingTime}</span>
        </div>
      </div>
    </div>
  );
}
