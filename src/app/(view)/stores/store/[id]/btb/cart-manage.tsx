/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Catalog from "./catalog";
import WholesaleCart from "./cart";

export interface CartItem {
  id: string;
  product_id: number;
  name: string;
  image: string;
  unitPrice: number;
  minOrderQty: number;
  quantity: number;
  slug: string;
}

export default function CartManage({ id }: { id: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("b2b-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("b2b-cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("b2b-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, quantity: number) => {
    const cartItem: CartItem = {
      id: `${product.product_id}`,
      product_id: product.product_id,
      name: product.product_name,
      image: product.product_image || "/placeholder.svg?height=80&width=80",
      unitPrice: Number.parseFloat(product.b2b_details.wholesale_price),
      minOrderQty: product.b2b_details.moq,
      quantity: Math.max(quantity, product.b2b_details.moq),
      slug: product.slug,
    };

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product_id === product.product_id
      );

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + cartItem.quantity,
        };
        return updatedItems;
      } else {
        // New item, add to cart
        return [...prevItems, cartItem];
      }
    });
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const quantity = Math.max(item.minOrderQty, newQuantity);
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
  };

  return (
    <>
      <Catalog id={id} addToCart={addToCart} cartItems={cartItems} />
      <WholesaleCart
        cartItems={cartItems}
        setCartItems={setCartItems}
        updateQuantity={updateCartItemQuantity}
        removeItem={removeFromCart}
        clearCart={clearCart}
        getCartItemCount={getCartItemCount}
        getCartTotal={getCartTotal}
      />
    </>
  );
}
