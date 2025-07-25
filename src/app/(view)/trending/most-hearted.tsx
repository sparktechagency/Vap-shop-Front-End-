/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "@/components/core/product-card";
import React from "react";
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

export default function MostHearted() {
  const { data: mosthartedproducts, refetch } = useMosthartedProductQuery();
  const { data: ProductsAds, refetch: refetchAds } = useGetproductsAdsQuery();

  console.log("ProductsAds", ProductsAds);

  return (
    <>
      <div className="w-full flex justify-end items-center gap-6 !my-12">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disposables">Disposables</SelectItem>
            <SelectItem value="ejuice">E-juice</SelectItem>
            <SelectItem value="pods">PODS</SelectItem>
            <SelectItem value="mods">MODS</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uni">Worldwide</SelectItem>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Canada</SelectLabel>
              <SelectItem value="on">Ontario</SelectItem>
              <SelectItem value="br">British Columbia</SelectItem>
              <SelectItem value="al">Alberta</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>United States</SelectLabel>
              <SelectItem value="tn">Tennessee (TN)</SelectItem>
              <SelectItem value="ga">Georgia (GA)</SelectItem>
              <SelectItem value="tx">Texas (TX)</SelectItem>
              <SelectItem value="fl">Florida (FL)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 !my-6">
        {/* Content for Most Hearted Products */}

        {ProductsAds?.data?.map((item: any, i: number) => (
          <ProductCard
            refetch={refetch}
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
        ))}
      </div>
      <h2 className="font-semibold text-2xl !mt-12 text-center">
        Top 50 Trending Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {mosthartedproducts?.data?.map((product: any) => (
          <ProductCard
            refetch={refetch}
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
      </div>
    </>
  );
}
