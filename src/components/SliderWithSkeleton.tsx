"use client";

import { useGetHomeBannerQuery } from "@/redux/features/Home/HomePageApi";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { SliderSkeleton } from "./SliderSkeletion";

const ProductCarousel = dynamic(() => import("@/components/product-carousel"), { ssr: false });

interface SliderItem {
  id: number;
  image: string;
  alt: string;
}

interface RawSlider {
  id: number;
  image: string;
}



export default function SliderWithSkeleton() {
  const { data: sliderData, isLoading: isSliderLoading } =
    useGetHomeBannerQuery();



  const slides: SliderItem[] = useMemo(() => (

    sliderData?.data?.map((slider: RawSlider) => ({
      id: slider.id,
      image: slider.image,
      alt: `Slider Image ${slider.id}`,
    }))
  ), [sliderData]);

  return isSliderLoading ? (
    <SliderSkeleton />
  ) : (
    <ProductCarousel slides={slides} />
  );
}
