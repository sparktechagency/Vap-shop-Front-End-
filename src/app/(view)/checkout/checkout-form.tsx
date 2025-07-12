"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCheckoutMutation } from "@/redux/features/store/StoreApi";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  fullname: z.string({ required_error: "Please input your full name" }).min(1),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().min(1, "Please enter your delivery address"),
});

// Function to format date to DD-MM-YYYY
const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export default function CheckoutForm({ cartItems }: {
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
  }>
}) {
  const [checkout, { isLoading }] = useCheckoutMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Format the date to DD-MM-YYYY if it exists
      const formattedDob = values.dob ? formatDateToDDMMYYYY(values.dob) : "";

      const checkoutData = {
        customer_name: values.fullname,
        customer_email: values.email,
        customer_phone: values.phone ? values.phone.slice(0, 15) : "",
        customer_dob: formattedDob || '24-04-1987',
        customer_address: values.address,
        cart_items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };
      const result = await checkout(checkoutData).unwrap();
      if (result?.ok) {
        toast.success("Order placed successfully!", {
          description: "Thank you for your purchase.",
        });
        form.reset();
        localStorage.removeItem('cart');
      }
      if (result?.error) {
        toast.error(result?.error || "Checkout failed");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Checkout failed");

      // Handle API validation errors
      if (error.data?.errors) {
        const errors = error.data.errors;

        // Set form errors for each field
        if (errors.customer_phone) {
          form.setError("phone", {
            type: "manual",
            message: errors.customer_phone[0],
          });
        }
        if (errors.customer_dob) {
          form.setError("dob", {
            type: "manual",
            message: errors.customer_dob[0],
          });
        }

        // Show general error message
        toast.error("Validation error", {
          description: "Please check the form for errors.",
        });
      } else {
        // Show generic error message for other errors
        toast.error("Checkout failed", {
          description: error.data?.message || "An unknown error occurred",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="!space-y-8">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="(optional)" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input placeholder="(optional)" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Delivery Address" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm">
          Note: Your order request will be sent to <b>VooPoo</b>.
        </p>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Send order request"}
        </Button>
      </form>
    </Form>
  );
}