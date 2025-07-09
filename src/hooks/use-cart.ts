"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Custom event to notify components in the same tab about cart changes
const CART_UPDATED_EVENT = "cart-updated";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // This function saves the cart and, crucially, dispatches an event
  // that the rest of the application can listen for.
  const saveCartAndNotify = (cart: CartItem[]) => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event(CART_UPDATED_EVENT)); // This is the key to no-refresh updates
      setCartItems(cart); // Also update the state of the current component
    } catch (error) {
      toast.error("Could not update your cart.");
      console.error(error);
    }
  };

  const addItem = (newItem: CartItem) => {
    // We get a fresh copy of the cart to avoid race conditions
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    const existingItemIndex = cart.findIndex((item) => item.id === newItem.id);

    if (existingItemIndex > -1) {
      // If item exists, just update its quantity
      cart[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Otherwise, add the new item
      cart.push(newItem);
    }

    saveCartAndNotify(cart);
    toast.success(`${newItem.quantity} ${newItem.name} added to cart`);
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCartAndNotify(updatedCart);
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id); // If quantity is zero, remove the item
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCartAndNotify(updatedCart);
  };

  // This effect runs in every component that uses the hook.
  // It loads the cart and listens for the update event.
  useEffect(() => {
    setIsClient(true);
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
    };

    loadCart(); // Load on initial render

    window.addEventListener(CART_UPDATED_EVENT, loadCart); // Listen for updates

    // Cleanup listener when component unmounts
    return () => window.removeEventListener(CART_UPDATED_EVENT, loadCart);
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    totalPrice,
    isClient,
  };
}
