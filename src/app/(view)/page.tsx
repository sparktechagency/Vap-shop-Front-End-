/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SliderWithSkeleton, {
  SliderSkeleton,
} from "@/components/SliderWithSkeleton";
import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";
import Link from "next/link";

export default function Home() {
  const { data: categorys, isLoading: isCategoriesLoading } =
    useGetallCategorysQuery();
  console.log(categorys);

  const trendingCategories = categorys?.data?.map(
    (category: any) => category
  ) || [
      "Pod Systems",
      "Mod Kits",
      "Disposable Vapes",
      "Nicotine Pouches",
      "E-Liquids",
      "Coils & Pods",
    ];

  if (isCategoriesLoading) {
    return (
      <div className="w-screen !py-12">
        <SliderSkeleton />
        <div className="!py-12">
          <h1 className="font-bold text-2xl md:text-4xl text-center mb-12 opacity-10">
            Trending
          </h1>
          <div className="!p-12 !px-[7%] grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="size-20 lg:size-[150px] xl:size-[200px] rounded-3xl bg-gray-200 animate-pulse" />
                <div className="w-3/4 h-4 mt-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  const categoryImageSet = [
    "/image/home/kits.webp",
    "/image/home/disposables.webp",
    "/image/home/eliquids.webp",
    "/image/home/brands.webp",
    "/image/home/nic.webp",
    "/image/home/accessories.webp",
    "/image/home/others.jpg",
  ];
  return (
    <>
      <header className="w-screen !py-12">
        <SliderWithSkeleton />

        <div className="!py-12 mx-auto">
          <h1 className="font-bold text-2xl md:text-4xl text-center">
            Trending
          </h1>
          <div className="flex justify-center">
            <div className="!p-12 !px-[7%] grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-6 justify-center place-items-center">
              {trendingCategories.map((cat: any, i: number) => (
                <Link href={`/trending?title=${cat.name}`} key={i}>
                  <div className="w-full flex flex-col justify-center items-center hover:scale-105 transition-transform cursor-pointer">
                    <div
                      className="size-20 lg:size-[150px] xl:size-[220px] rounded-3xl border bg-cover bg-center bg-no-repeat overflow-hidden"
                      style={{
                        backgroundImage: `url(${cat.image})`,
                      }}
                    />
                    <div className="w-full text-center font-semibold !pt-4 text-xs sm:text-sm md:text-xl">
                      {cat.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
