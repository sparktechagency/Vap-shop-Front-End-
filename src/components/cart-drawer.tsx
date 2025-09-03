
"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { ShoppingCartIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartDrawer() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { data: userData } = useGetOwnprofileQuery()
  const user_id = userData?.data?.id

  const cartKey = user_id ? `cart_${user_id}` : null;

  // Ensure we're on the client before accessing localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load cart items from localStorage
  useEffect(() => {
    if (!isClient || !cartKey) {
      setCartItems([]); // Clear cart if no user or key
      return;
    }

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
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, [isClient, cartKey]);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const removeItem = (id: string) => {
    if (!cartKey) return;
    try {
      const updatedCart = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1 || !cartKey) return;

    try {
      const updatedCart = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );

      setCartItems(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error("Error updating quantity:", error);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
    setIsOpen(false);
  };

  if (!isClient) {
    return (
      <Button size="icon" variant="ghost" className="relative">
        <ShoppingCartIcon />
      </Button>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <ShoppingCartIcon />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[100dvh] lg:h-[80dvh]">
        <DrawerHeader>
          <div className="flex w-full justify-between items-center">
            <DrawerTitle>Your Cart ({cartItems.length} items)</DrawerTitle>
            <div className="flex justify-center items-center gap-4">
              {cartItems.length > 0 && (
                <Button onClick={handleCheckout} variant="special">
                  Checkout (${totalPrice.toFixed(2)})
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <ShoppingCartIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-500">Your cart is empty</p>
              <DrawerClose asChild>
                <Button variant="outline" className="mt-4">
                  Continue Shopping
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="relative h-16 w-16">
                    <Image
                      src={item.image || "/image/shop/item.jpg"}
                      alt={item.name}
                      fill
                      className="rounded-md object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}