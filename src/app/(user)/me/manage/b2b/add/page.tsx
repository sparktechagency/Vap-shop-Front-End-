/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ProductCard from "@/components/core/product-card";
import { useSearchQuery } from "@/redux/features/others/otherApi";
import { useBtbProductPricingMutation } from "@/redux/features/b2b/btbApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Schema ---
const productSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  price: z.string().min(1, "Price is required"),
  moq: z.string().min(1, "Minimum Order Quantity is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Page() {
  const navig = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onSubmit",
    defaultValues: {
      productId: "",
      price: "",
      moq: "",
    },
  });

  const productSearch = form.watch("productId"); // using 'productId' to control search input
  const debouncedSearch = useDebounce(productSearch, 100);

  const { data, isLoading } = useSearchQuery(
    { search: debouncedSearch, type: "products" },
    { skip: !debouncedSearch }
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const [postProduct] = useBtbProductPricingMutation();

  // Close suggestion on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Form Submit ---
  const onSubmit = async (data: ProductFormValues) => {
    toast.info("Still under development");
    return;
    try {
      const res: any = await postProduct({
        body: {
          productable_id: data.productId,
          wholesale_price: data.price,
          moq: data.moq,
        },
      }).unwrap();

      if (!res.ok) {
        toast.error(res?.message ?? "Something went wrong.");
      } else {
        toast.success(res.data?.message ?? "Product added successfully!");
        navig.push("/me/manage");
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong.");
      console.error(error);
    }
  };

  return (
    <div className="py-12!">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product Preview */}
        <div className="order-2 lg:order-1">
          {selectedProduct ? (
            <ProductCard
              data={{
                title: selectedProduct.product_name,
                image: selectedProduct.product_image,
                category: selectedProduct.role_label,
                note: "",
              }}
            />
          ) : (
            <div className="w-full aspect-square bg-card border rounded-md flex justify-center items-center text-muted-foreground">
              Select a product to preview
            </div>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6! order-1 lg:order-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6!">
              {/* Product Search Field */}
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem className="relative" ref={inputRef}>
                    <FormLabel>Search Product Name:</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          value={selectedProduct?.product_name || field.value}
                          onFocus={() => setShowSuggestions(true)}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setSelectedProduct(null); // Clear selection
                            setShowSuggestions(true);
                          }}
                        />
                        {!isLoading && showSuggestions && (
                          <div className="absolute w-full top-full left-0 bg-card rounded-md border z-10 mt-1 max-h-60 overflow-y-auto">
                            {data?.data?.data?.map((item: any, i: number) => (
                              <Button
                                key={i}
                                type="button"
                                variant="ghost"
                                className="w-full justify-start text-left"
                                onClick={() => {
                                  form.setValue("productId", String(item.id), {
                                    shouldValidate: true,
                                  });
                                  setSelectedProduct(item);
                                  setShowSuggestions(false);
                                }}
                              >
                                <Avatar className="size-6">
                                  <AvatarImage src={item?.product_image} />
                                  <AvatarFallback className="text-xs">
                                    {item?.product_name?.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>{" "}
                                {item?.product_name}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wholesale Price:</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MOQ */}
              <FormField
                control={form.control}
                name="moq"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Quantity:</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">List product on Wholesale</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
