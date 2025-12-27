"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import CheckoutForm from "./checkout-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  ownerid: string;
  ownerTax: number;
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

  // --- CALCULATIONS START ---

  // 1. Calculate the price of items without tax
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 2. Calculate the total tax amount based on each item's specific tax rate
  const totalTaxAmount = cartItems.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const taxAmount = itemTotal * (Number(item.ownerTax) / 100);
    return sum + taxAmount;
  }, 0);

  // 3. Final Total
  const grandTotal = subTotal + totalTaxAmount;

  // --- CALCULATIONS END ---

  return (
    <main className="!py-12 !px-4 md:!px-[7%] grid grid-cols-1 lg:grid-cols-7 gap-12">
      <div className="col-span-7">
        <h1 className="text-4xl font-bold">Checkout</h1>
      </div>

      <div className="lg:col-span-5 !space-y-12">
        <Card>
          <CardContent className="pt-6">
            {/* NOTE: You might want to pass the grandTotal 
                to CheckoutForm if your payment logic needs it there 
            */}
            <CheckoutForm
              cartItems={cartItems.map((item) => ({
                id: parseInt(item.id),
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || null,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="w-full sticky top-4">
          <CardHeader>
            <CardTitle>Your order</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>
              <ol className="!space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-2 pb-4 border-b last:border-0"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="flex gap-3">
                          <div className="relative h-16 w-16 min-w-[4rem]">
                            <Image
                              src={item.image || "/image/shop/item.jpg"}
                              alt={item.name}
                              fill
                              className="rounded-md object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>

                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Individual Item Tax Display */}
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>Tax ({item.ownerTax}%)</span>
                        <span>
                          +$
                          {(
                            item.price *
                            item.quantity *
                            (Number(item.ownerTax) / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </CardDescription>
          </CardContent>

          {/* Summary Section */}
          <div className="px-6 pb-4">
            {/* If you don't have a Separator component, use <hr className="my-4" /> */}
            <hr className="my-4 border-gray-200" />
          </div>

          <CardFooter className="flex flex-col gap-3 pb-6">
            <div className="flex justify-between w-full text-sm text-gray-600">
              <p>Subtotal</p>
              <p>${subTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between w-full text-sm text-gray-600">
              <p>Total Tax</p>
              <p>${totalTaxAmount.toFixed(2)}</p>
            </div>

            <hr className="w-full border-gray-200 my-1" />

            <div className="flex justify-between w-full font-bold text-lg">
              <p>Total</p>
              <p>${grandTotal.toFixed(2)}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
