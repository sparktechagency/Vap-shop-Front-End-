"use client";

import { useGetHomeBannerQuery } from "@/redux/features/Home/HomePageApi";
import React, { useMemo } from "react";
import { SliderSkeleton } from "./SliderSkeletion";
import ProductCarousel from "./product-carousel";



interface SliderItem {
  id: number;
  image: string;
  alt: string;
}

interface RawSlider {
  id: number;
  image: string;
  link: string;
}



export default function SliderWithSkeleton() {
  const { data: sliderData, isLoading: isSliderLoading } =
    useGetHomeBannerQuery();



  const slides: SliderItem[] = useMemo(() => (

    sliderData?.data?.map((slider: RawSlider) => ({
      id: slider.id,
      image: slider.image,
      alt: `Slider Image ${slider.id}`,
      url: slider?.link,
    }))
  ), [sliderData]);

  return isSliderLoading ? (
    <SliderSkeleton />
  ) : (
    <ProductCarousel slides={slides} />
  );
}
