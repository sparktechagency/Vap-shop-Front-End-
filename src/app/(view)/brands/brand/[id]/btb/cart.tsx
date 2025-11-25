"use client";
import { useState } from "react";
import type React from "react";

import Image from "next/image";
import {
  Minus,
  Package2Icon,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "./cart-manage";
import { usePathname, useRouter } from "next/navigation";

interface WholesaleCartProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

export default function WholesaleCart({
  cartItems,
  updateQuantity,
  removeItem,
  clearCart,
  getCartItemCount,
  getCartTotal,
}: WholesaleCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const navig = useRouter();
  const totalItems = getCartItemCount();
  const subtotal = getCartTotal();
  const total = subtotal;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      const quantity = Math.max(item.minOrderQty, newQuantity);
      updateQuantity(productId, quantity);
    }
  };

  const incrementQuantity = (productId: string, increment = 10) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + increment);
    }
  };

  const decrementQuantity = (productId: string, decrement = 10) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      const newQuantity = Math.max(item.minOrderQty, item.quantity - decrement);
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 size-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2"
          size="icon"
          variant={"special"}
        >
          <div className="relative">
            <Package2Icon className="size-6" />
            {cartItems.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 size-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
              >
                {cartItems.length}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-[420px] h-[600px] p-0 mb-4 shadow-2xl border-2"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-slate-50">
            <div>
              <h3 className="font-bold text-lg">Wholesale Cart</h3>
              <p className="text-sm text-muted-foreground">
                {totalItems.toLocaleString()} items • {cartItems.length}{" "}
                products
              </p>
            </div>
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="size-8"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="size-12 text-muted-foreground mb-4" />
                <h4 className="font-semibold text-lg mb-2">
                  Your cart is empty
                </h4>
                <p className="text-sm text-muted-foreground">
                  Add wholesale products to get started
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="relative">
                        <Image
                          src={
                            item.image || "/placeholder.svg?height=80&width=80"
                          }
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg border object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm leading-tight">
                              {item.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Min order: {item.minOrderQty.toLocaleString()}{" "}
                              units
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="size-6 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-semibold">
                              ${item.unitPrice.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              per unit
                            </span>
                          </div>
                          <div className="text-sm font-semibold">
                            ${(item.unitPrice * item.quantity).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => decrementQuantity(item.id, 10)}
                            disabled={item.quantity <= item.minOrderQty}
                            className="size-7"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                Number.parseInt(e.target.value) ||
                                  item.minOrderQty
                              )
                            }
                            className="w-20 h-7 text-center text-sm"
                            min={item.minOrderQty}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => incrementQuantity(item.id, 10)}
                            className="size-7"
                          >
                            <Plus className="size-3" />
                          </Button>
                          <span className="text-xs text-muted-foreground ml-1">
                            units
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Footer with totals and actions */}
          {cartItems.length > 0 && (
            <div className="border-t bg-slate-50 p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Total ({totalItems.toLocaleString()} items)</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    localStorage.setItem("btbCart", JSON.stringify(cartItems));
                    navig.push(`${path}/payment`);
                  }}
                >
                  Request Quote
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Final pricing will be confirmed after quote review
                </p>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
