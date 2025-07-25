"use client";
import React, { useState } from "react";
import Catalog from "./catalog";
import WholesaleCart from "./cart";
export interface CartItem {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  minOrderQty: number;
  quantity: number;
}
export default function CartManage({ id }: { id: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "RavenBlood Biometal",
      image: "/placeholder.svg?height=80&width=80",
      unitPrice: 40,
      minOrderQty: 100,
      quantity: 250,
    },
    {
      id: "2",
      name: "Titanium Alloy Sheet",
      image: "/placeholder.svg?height=80&width=80",
      unitPrice: 85,
      minOrderQty: 50,
      quantity: 150,
    },
    {
      id: "3",
      name: "Carbon Fiber Panel",
      image: "/placeholder.svg?height=80&width=80",
      unitPrice: 120,
      minOrderQty: 25,
      quantity: 75,
    },
  ]);
  return (
    <>
      <Catalog id={id} />
      <WholesaleCart cartItems={cartItems} setCartItems={setCartItems} />
    </>
  );
}
