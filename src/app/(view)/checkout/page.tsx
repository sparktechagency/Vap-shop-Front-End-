'use client';

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = localStorage.getItem('cart');
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

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', handleStorageChange);
    };
  }, []);

  // Update localStorage and state when cartItems change
  const updateCart = (newCartItems: CartItem[]) => {
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    // Dispatch both storage and custom events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const removeItem = (id: string) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== id);
      updateCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const updatedCart = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCart);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="!py-12 !px-4 md:!px-[7%] grid grid-cols-1 lg:grid-cols-7 gap-12">
      <div className="col-span-7">
        <h1 className="text-4xl font-bold">Checkout</h1>
      </div>

      <div className="lg:col-span-5 !space-y-12">
        <Card>
          <CardContent className="pt-6">
            <CheckoutForm />
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
                    <li key={item.id} className="flex flex-col gap-2 pb-4 border-b">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex gap-3">
                          <div className="relative h-16 w-16">
                            <Image
                              src={item.image || "/image/shop/item.jpg"}
                              alt={item.name}
                              fill
                              className="rounded-md object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
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

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </CardDescription>
          </CardContent>

          <Separator />

          <CardFooter className="py-4">
            <div className="flex justify-between w-full font-bold text-lg">
              <p>Total</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}