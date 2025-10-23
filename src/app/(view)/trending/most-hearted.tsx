/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "@/components/core/product-card";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronLeft, Globe } from "lucide-react";
import {
  useGetproductsAdsQuery,
  useMosthartedProductQuery,
} from "@/redux/features/Trending/TrendingApi";
import { useCountysQuery } from "@/redux/features/AuthApi";
import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";

export default function MostHearted() {
  const [category, setCategory] = useState<any>("");
  const [region, setRegion] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const {
    data: mosthartedproducts,
    refetch: refetchMostHearted,
    isError,
    error,
  }: any = useMosthartedProductQuery({ category, region });

  const {
    data: ProductsAds,
    refetch: refetchAds,
    isError: isAdError,
    error: adError,
  }: any = useGetproductsAdsQuery({ region });

  const { data: cats, isLoading: catLoading } = useGetallCategorysQuery();
  const { data: countries, isLoading: countriesLoading } = useCountysQuery();

  useEffect(() => {
    refetchMostHearted();
  }, [category, region, refetchMostHearted]);

  const handleSelectRegion = (val: string) => {
    setRegion(val);
    setOpen(false);
  };

  return (
    <>
      <div className="w-full flex justify-end items-center gap-6 !my-12">
        {/* Category Select */}
        <Select
          onValueChange={(val) => setCategory(Number(val))}
          value={category.toString()}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {!catLoading &&
              cats?.data?.map((x: any) => (
                <SelectItem value={x.id.toString()} key={x.id}>
                  {x.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Country → Region Popover */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[180px] justify-between transition"
            >
              {region === ""
                ? "Worldwide"
                : (() => {
                  const country = countries?.data?.find((c: any) =>
                    c.regions.some((r: any) => r.id.toString() === region)
                  );
                  const regionData = country?.regions?.find(
                    (r: any) => r.id.toString() === region
                  );
                  return regionData
                    ? `${regionData.name} (${regionData.code})`
                    : "Select Region";
                })()}
              <ChevronDownIcon
                className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
                  }`}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[340px]! p-2" align="end">
            {selectedCountry ? (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCountry(null)}
                  className="text-muted-foreground flex items-center gap-1 mb-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                {selectedCountry.regions.map((r: any) => (
                  <Button
                    key={r.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleSelectRegion(r.id.toString())}
                  >
                    {r.name} ({r.code})
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectRegion("")}
                  className="flex items-center gap-2 justify-start"
                >
                  <Globe className="w-4 h-4" /> Worldwide
                </Button>

                {!countriesLoading &&
                  countries?.data?.map((c: any) => (
                    <Button
                      key={c.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCountry(c)}
                    >
                      {c.name}
                    </Button>
                  ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Product Ads */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 !my-6">
        {isAdError ? (
          <div className="py-4 col-span-4 flex justify-center items-center">
            {adError?.data?.message}
          </div>
        ) : (
          ProductsAds?.data?.map((item: any, i: number) => (
            <ProductCard
              refetch={refetchMostHearted}
              refetchAds={refetchAds}
              data={{
                id: item.product_id,
                image: item?.product_image || "/image/shop/item.jpg",
                title: item?.product_name,
                category: item?.brand || "PODS",
                price: item?.wholesale_price,
                discount: item.product_discount,
                hearts: item.hearts_count,
                is_hearted: item.is_hearted,
                type: "ad",
              }}
              link={`/brands/brand/product/${item.id}`}
              key={i}
            />
          ))
        )}
      </div>

      {/* Trending Products */}
      <h2 className="font-semibold text-2xl !mt-12 text-center">
        Top 50 Trending Products
      </h2>
      {isError ? (
        <div className="py-4 flex justify-center items-center">
          {error?.data?.message}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
          {mosthartedproducts?.data?.map((product: any) => (
            <ProductCard
              refetch={refetchMostHearted}
              refetchAds={refetchAds}
              data={{
                id: product.id,
                image: product.product_image || "/image/shop/item.jpg",
                title: product.product_name,
                category: product.brand || "PODS",
                price: product.product_price,
                discount: product.product_discount,
                hearts: product.hearts_count,
                is_hearted: product.is_hearted,
              }}
              link={`/brands/brand/product/${product.id}`}
              key={product.id}
            />
          ))}
          {mosthartedproducts?.data?.length <= 0 && (
            <div className="flex justify-center items-center h-12 w-full">
              No Most Hearted Product Found
            </div>
          )}
        </div>
      )}
    </>
  );
}
