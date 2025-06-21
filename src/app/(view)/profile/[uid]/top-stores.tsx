import StoreProdCard from "@/components/core/store-prod-card";
import { BrandType } from "@/lib/types/product";
import React from "react";

const mockData: BrandType = {
  id: "1",
  image: "/image/shop/brand.webp",
  storeName: "Vape Juice Deport",
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
  type: "normal",
};
export default function TopStores() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 !pt-10 lg:!p-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <StoreProdCard data={mockData} key={i} />
      ))}
    </div>
  );
}
