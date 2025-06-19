import BrandProdCard from "@/components/core/brand-prod-card";
import ProductCarousel from "@/components/product-carousel";
import { Button } from "@/components/ui/button";
import { BrandType } from "@/lib/types/product";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
const slides = [
  {
    id: 1,
    image: "/image/home/car3.png",
    alt: "ARGUS Z2 Product",
  },
  {
    id: 2,
    image: "/image/home/car2.png",
    alt: "ARGUS Z2 Side View",
  },
  {
    id: 3,
    image: "/image/home/car2.png",
    alt: "ARGUS Z2 Features",
  },
  {
    id: 4,
    image: "/image/home/car1.png",
    alt: "ARGUS Z2 Colors",
  },
  {
    id: 5,
    image: "/image/home/car3.png",
    alt: "ARGUS Z2 Usage",
  },
];

const mockData: BrandType = {
  id: "1",
  image: "/image/shop/brand.webp",
  type: "normal",
  storeName: "SMOK",
  isVerified: true,
  location: {
    city: "BROOKLYN, New York",
    distance: "4 mi",
  },
  rating: {
    value: 4.9,
    reviews: 166,
  },
  isOpen: true,
  closingTime: "10 PM",
};
export default function Page() {
  return (
    <div className="!my-12">
      <ProductCarousel slides={slides} />
      <div className="!px-4 lg:!px-[7%] !mt-12">
        <h3 className="text-xl md:text-4xl  font-semibold">Brands</h3>
        <div className="w-full flex justify-end items-center">
          <Button variant="link" asChild>
            <Link href="/map">
              <ArrowLeftIcon /> Map View
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <BrandProdCard data={mockData} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
