// components/product/ProductPrice.tsx
"use client";

import { Button } from "@/components/ui/button";
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
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    description?: string;
}

export function ProductPrice({
    currentPrice,
    originalPrice,
    productId,
    productName,
    productImage,
    initialQuantity = 1,
    description
}: ProductPriceProps) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleAddToCart = () => {
        // Get existing cart from localStorage
        const existingCart = typeof window !== 'undefined'
            ? localStorage.getItem('cart')
            : null;

        let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex >= 0) {
            // Update quantity if product exists
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't exist
            cart.push({
                id: productId,
                name: productName,
                price: currentPrice,
                quantity: quantity,
                image: productImage,
                description
            });
        }

        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
            // Dispatch storage event to trigger updates in other components
            window.dispatchEvent(new Event('storage'));
        }

        // Show success message
        toast.success(`${quantity} ${productName} added to cart`);
    };
    return (
        <div className="flex flex-col gap-3 font-sans">
            {/* Price display */}
            <div className="flex items-baseline gap-2">
                <span className="text-4xl text-gray-700">Price:</span>
                <span className="text-3xl font-bold text-green-600">
                    ${currentPrice.toFixed(2)}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                    <span className="text-xl line-through text-gray-400">
                        ${originalPrice.toFixed(2)}
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
                <Button
                    variant={"default"}
                    onClick={handleAddToCart}
                >
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