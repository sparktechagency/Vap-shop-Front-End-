import BrandProdCard from "@/components/core/brand-prod-card";
import { BrandType } from "@/lib/types/product";
import React from "react";

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
export default function TopBrands() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 !pt-10 lg:!p-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <BrandProdCard data={mockData} key={i} />
      ))}
    </div>
  );
}
