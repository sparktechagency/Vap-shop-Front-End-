"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import CheckoutForm from "./checkout-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import {
  useGetOwnprofileQuery,
  useGtStoreDetailsQuery,
} from "@/redux/features/AuthApi";
import { useParams } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { data: userData } = useGetOwnprofileQuery();

  const user_id = userData?.data?.id;
  const cartKey = `cart_${user_id}`;
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = localStorage.getItem(cartKey);
        setCartItems(cart ? JSON.parse(cart) : []);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
      }
    };

    loadCart();

    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleStorageChange);
    };
  }, []);

  // Update localStorage and state when cartItems change
  const updateCart = (newCartItems: CartItem[]) => {
    setCartItems(newCartItems);
    localStorage.setItem(cartKey, JSON.stringify(newCartItems));
    // Dispatch both storage and custom events
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const removeItem = (id: string) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      updateCart(updatedCart);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCart);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="!py-12 !px-4 md:!px-[7%] w-full lg:max-w-2/3 mx-auto">
      <div className="col-span-7">
        <h1 className="text-4xl font-bold pb-8">B2B Checkout</h1>
      </div>

      <div className="lg:col-span-5 !space-y-12">
        <Card>
          <CardContent className="pt-6">
            <CheckoutForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
