/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

export default function ProductCarousel({
  slides,
}: {
  slides: {
    id: number;
    image: string;
    alt: string;
    url?: string | null;
  }[];
}) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  const plugin = Autoplay({ delay: 4000, stopOnInteraction: false });

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin]}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {slides?.map((slide, i) => (
            <CarouselItem key={i} className="basis-1/2 !ml-4">
              <Card className="!p-0 overflow-hidden">
                {slide.url ? (
                  <Link
                    href={slide.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <CardContent
                      className="flex aspect-video items-center justify-center !p-0 overflow-hidden bg-center bg-no-repeat bg-cover cursor-pointer"
                      style={{ backgroundImage: `url('${slide.image}')` }}
                    />
                  </Link>
                ) : (
                  // If no URL, render the CardContent directly
                  <CardContent
                    className="flex aspect-video items-center justify-center !p-0 overflow-hidden bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url('${slide.image}')` }}
                  />
                )}
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex justify-center !mt-4 gap-2">
        {slides?.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              current === index ? "bg-purple-600 w-4" : "bg-gray-300"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
