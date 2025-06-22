import StoreProdCard from "@/components/core/store-prod-card";
import { useUser } from "@/context/userContext";
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
  const user = useUser();
  const role = parseInt(user?.role ?? "", 10);
  const isMember = role === 6;

  if (!isMember) {
    return (
      <p className="text-center text-sm text-muted">
        You don&apos;t have access to this
      </p>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 pt-10 lg:p-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <StoreProdCard data={mockData} key={i} />
      ))}
    </div>
  );
}
