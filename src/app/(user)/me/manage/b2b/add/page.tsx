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

import { usePostProductMutation } from "@/redux/features/manage/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- util hook ---
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
  brandName: z.string().min(1, "Product name is required"),
  productName: z.string().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock info is required"),
  description: z.string().min(1, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Import() {
  const navig = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      brandName: "",
      productName: "",
      price: "",
      stock: "",
      description: "",
    },
  });

  const brandName = form.watch("brandName");
  const debouncedBrand = useDebounce(brandName, 100);

  const { data, isLoading, error } = useSearchQuery(
    { search: debouncedBrand, type: "brand" },
    { skip: !debouncedBrand }
  );

  if (error) console.error(error);
  if (data) console.log(data);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const [postProduct] = usePostProductMutation();

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

  const onSubmit = async (data: ProductFormValues) => {
    toast.info("Under Development!");
    return;

    if (!selectedProduct) {
      toast.error("Please select a product.");
      return;
    }

    try {
      const finalizer = {
        brand_name: data.brandName,
        category_id: selectedProduct.category_id,
        product_id: selectedProduct.id,
        product_price: data.price,
        product_discount: 0,
        product_discount_unit: 0,
        product_stock: data.stock,
        product_description: data.description,
      };
      const res: any = await postProduct(finalizer);
      console.log(res);

      if (!res.ok) {
        toast.error(res?.message ?? "Something went wrong.");
      } else {
        toast.success(res.data?.message ?? "Success!");
      }
      toast.success(res?.message ?? "Product added successfully!");
      navig.push("/me/manage");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong.");
      console.error(error);
    }
  };

  return (
    <div className="py-12!">
      {/* <Button
        onClick={() => {
          console.log(selectedProduct);
        }}
      >
        Magic button
      </Button> */}
      <div className="grid lg:grid-cols-2 gap-6">
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

        <div className="space-y-6! order-1 lg:order-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6!">
              {/* Brand Name Field */}
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem className="relative" ref={inputRef}>
                    <FormLabel>Select your product:</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onFocus={() => setShowSuggestions(true)}
                          onChange={(e) => {
                            field.onChange(e);
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
                                  form.setValue("brandName", item.full_name);
                                  setShowSuggestions(false);
                                  setSelectedBrand(item.id);
                                }}
                              >
                                <Avatar className="size-6">
                                  <AvatarImage src={item.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {item.full_name.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>{" "}
                                {item.full_name}
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

              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
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
