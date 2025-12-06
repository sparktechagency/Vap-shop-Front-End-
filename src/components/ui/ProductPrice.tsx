// components/product/ProductPrice.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { useState } from "react";
import { toast } from "sonner";

interface ProductPriceProps {
  currentPrice: number;
  originalPrice?: number;
  productId: string;
  productName: string;
  productImage?: string;
  initialQuantity?: number;
  description?: string;
  userId: string;
  userTax: number;
}

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

export function ProductPrice({
  userId,
  userTax,
  currentPrice,
  originalPrice,
  productId,
  productName,
  productImage,
  initialQuantity = 1,
  description,
}: ProductPriceProps) {
  const { data: userData } = useGetOwnprofileQuery();
  const user_id = userData?.data?.id;

  const [quantity, setQuantity] = useState(initialQuantity);

  const handleAddToCart = () => {
    // 3. Check if the user is logged in
    if (!user_id) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    // 4. Create a user-specific cart key
    const cartKey = `cart_${user_id}`;

    const existingCart =
      typeof window !== "undefined"
        ? localStorage.getItem(cartKey) // Use the dynamic key
        : null;

    // eslint-disable-next-line prefer-const
    let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingItemIndex = cart.findIndex((item) => item.id === productId);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: currentPrice,
        quantity: quantity,
        image: productImage,
        description,
        ownerid: userId,
        ownerTax: userTax,
      });
    }

    if (typeof window !== "undefined") {
      // Use the dynamic key to save the cart
      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    }

    toast.success(`${quantity} ${productName} added to cart`);
  };

  return (
    <div className="flex flex-col gap-3 font-sans">
      {/* Price display */}
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "text-4xl text-gray-700",
            currentPrice <= 0 && "hidden"
          )}
        >
          Price:
        </span>

        {currentPrice > 0 ? (
          <>
            <span className="text-3xl font-bold text-green-600">
              ${currentPrice.toFixed(2)}
            </span>
            {originalPrice &&
              originalPrice > currentPrice &&
              originalPrice > 0 && (
                <span className="text-xl line-through text-gray-400">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
          </>
        ) : (
          <span className="text-3xl text-muted-foreground">
            Contact for Pricing
          </span>
        )}
      </div>

      {/* Amount Display */}
      <div className="flex items-center gap-2">
        <span className="text-xl text-gray-700">Quantity:</span>
        <span className="text-xl font-semibold">{quantity}</span>
      </div>

      {/* Add to Cart and Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={"default"}
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          aria-label="Decrease quantity"
        >
          -
        </Button>
        <Button variant={"default"} onClick={handleAddToCart}>
          Add to cart
        </Button>
        <Button
          variant={"default"}
          onClick={() => setQuantity((prev) => prev + 1)}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
    </div>
  );
}
