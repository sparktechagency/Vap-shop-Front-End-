import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductCard from "@/components/core/product-card";
import { Button } from "@/components/ui/button";

export default function Import() {
  const data = {
    image: "/image/shop/item.jpg",
    title: "Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)",
    category: "PODS",
    note: "93.1% THC",
  };
  return (
    <div className="py-12!">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <ProductCard data={data} />
        </div>
        <div className="!space-y-6 order-1 lg:order-2">
          <Label>Brand Name:</Label>
          <Input />
          <Label>Product Name:</Label>
          <Input />
          <Label>Price</Label>
          <Input />
          <Label>Available in stock</Label>
          <Input />
          <Button>Confirm product</Button>
        </div>
      </div>
    </div>
  );
}
