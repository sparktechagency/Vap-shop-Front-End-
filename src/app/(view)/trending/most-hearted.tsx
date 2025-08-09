/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "@/components/core/product-card";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetproductsAdsQuery,
  useMosthartedProductQuery,
} from "@/redux/features/Trending/TrendingApi";
import { useCountysQuery } from "@/redux/features/AuthApi";
import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";

export default function MostHearted() {
  const [category, setCategory] = useState(1);
  const [region, setRegion] = useState(""); // empty string means worldwide

  // Query with filters
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
  }: any = useGetproductsAdsQuery({
    region,
  });
  const { data: cats, isLoading: catLoading } = useGetallCategorysQuery();
  const { data: countries, isLoading: countriesLoading } = useCountysQuery();

  // Refetch when filters change
  useEffect(() => {
    refetchMostHearted();
  }, [category, region, refetchMostHearted]);

  return (
    <>
      <div className="w-full flex justify-end items-center gap-6 !my-12">
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

        <Select
          onValueChange={(val) => {
            // Treat blank or whitespace as worldwide = ""
            const cleanVal = val.trim() === "" || val === " " ? "" : val;
            setRegion(cleanVal);
          }}
          value={region === "" ? " " : region}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Worldwide</SelectItem>
            <SelectSeparator />
            {!countriesLoading &&
              countries?.data?.map((country: any, i: number) => (
                <React.Fragment key={`country-${country.id}`}>
                  <SelectGroup key={`group-${country.id}`}>
                    <SelectLabel>{country.name}</SelectLabel>
                    {country.regions.map((region: any) => (
                      <SelectItem
                        value={region.id.toString()}
                        key={`region-${region.id}`}
                      >
                        {region.name} ({region.code}){region.id}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {countries?.data?.length !== i + 1 && <SelectSeparator />}
                </React.Fragment>
              ))}
          </SelectContent>
        </Select>
      </div>

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
                note: `$${item.product_price}`,
                discount: item.product_discount,
                hearts: item.total_heart,
                is_hearted: item.is_hearted,
                type: "ad",
              }}
              link={`/brands/brand/product/${item.id}`}
              key={i}
            />
          ))
        )}
      </div>

      <h2 className="font-semibold text-2xl !mt-12 text-center">
        Top 50 Trending Products
      </h2>
      {isError ? (
        <div className="py-4  flex justify-center items-center">
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
                note: product.product_price,
                discount: product.product_discount,
                hearts: product.total_heart,
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
