"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileQuery } from "@/redux/features/AuthApi";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function LatestReviewCard({
  data,
  userId,
  product_user,
  noLinker,
}: {
  data: any;
  userId: number | string;
  product_user?: any;
  noLinker?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { data: me, isLoading } = useGetProfileQuery({ id: userId });

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted && isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden w-full">
      <div className="p-4 flex items-center gap-6">
        <Link
          className="flex items-center"
          href={
            data?.store_products?.role === 3
              ? `/brands/brand/product/${data?.store_products?.id}`
              : `/stores/store/product/${data?.store_products?.id}`
          }
        >
          <Image
            src={data?.store_products?.product_image ?? "/image/shop/item.jpg"}
            width={100}
            height={100}
            alt="icon"
            className="size-24 object-cover object-center rounded-lg"
          />
          <div className="ml-4">
            <h4 className="font-semibold text-xl">
              {data?.store_products?.product_name ?? ""}
            </h4>
          </div>
        </Link>
      </div>

      {noLinker ? (
        <div className="p-4 flex items-center gap-2 border-t border-b">
          <Avatar>
            <AvatarImage src={data?.user?.avatar} className="object-cover" />
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>

          <h4 className="text-sm font-semibold">{data?.user?.full_name}</h4>
        </div>
      ) : (
        <Link
          href={
            data?.user?.role === 3
              ? `/brands/brand/${data?.user?.id}`
              : data?.user?.role === 5
              ? `/stores/store/${data?.user?.id}`
              : `/profile/${data?.user?.id}`
          }
        >
          <div className="p-4 flex items-center gap-2 border-t border-b">
            <Avatar>
              <AvatarImage src={data?.user?.avatar} className="object-cover" />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>

            <h4 className="text-sm font-semibold">{data?.user?.full_name}</h4>
          </div>
        </Link>
      )}

      {/* Review Content */}
      <div className="p-4 !pb-1">
        <p className="text-sm leading-relaxed !mb-4">{data?.comment}</p>

        {/* Reviewer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground">
                {data?.updated_at
                  ? new Date(data?.updated_at).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          </div>
          {data?.rating && (
            <div className="!mb-3">
              <h4 className="font-semibold text-xs !mb-2">
                ⭐ {parseFloat(data?.rating).toFixed(1)}/5
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
