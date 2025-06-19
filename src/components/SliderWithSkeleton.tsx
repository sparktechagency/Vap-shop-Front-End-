"use client";
import ProductCarousel from "@/components/product-carousel";
import { useGetHomeBannerQuery } from "@/redux/features/Home/HomePageApi";

interface SliderItem {
  id: number;
  image: string;
  alt: string;
}

interface RawSlider {
  id: number;
  image: string;
}

export const SliderSkeleton = () => (
  <div className="w-full h-[400px] relative">
    <div className="absolute inset-0 flex space-x-4 px-4">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-200 rounded-xl animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  </div>
);

export default function SliderWithSkeleton() {
  const { data: sliderData, isLoading: isSliderLoading } =
    useGetHomeBannerQuery();

  if (sliderData) {
    console.log(sliderData);
  }

  const slides: SliderItem[] =
    sliderData?.data?.map((slider: RawSlider) => ({
      id: slider.id,
      image: slider.image,
      alt: `Slider Image ${slider.id}`,
    })) || [];

  return isSliderLoading ? (
    <SliderSkeleton />
  ) : (
    <ProductCarousel slides={slides} />
  );
}
