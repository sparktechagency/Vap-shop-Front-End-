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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ProductCard from "@/components/core/product-card";
import { useSearchQuery } from "@/redux/features/others/otherApi";
import { useGetBrandDetailsByIdQuery } from "@/redux/features/brand/brandApis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";

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
  brandName: z.string().min(1, "Brand name is required"),
  productName: z.string().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock info is required"),
  description: z.string().min(1, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Import() {
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
  const debouncedBrand = useDebounce(brandName, 400);

  const { data, isLoading, error } = useSearchQuery(
    { search: debouncedBrand, type: "brand" },
    { skip: !debouncedBrand }
  );

  if (error) console.error(error);
  if (data) console.log(data);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const {
    data: prods,
    isLoading: prodLoading,
    isError,
  } = useGetBrandDetailsByIdQuery(selectedBrand as any, {
    // skip: !selectedBrand,
  });

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

  const onSubmit = (data: ProductFormValues) => {
    console.log("Form submitted", data);
  };

  const cardData = {
    image: "/image/shop/item.jpg",
    title: "Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)",
    category: "PODS",
    note: "93.1% THC",
  };

  // if (prods) {
  //   console.log();
  // }

  return (
    <div className="py-12!">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <ProductCard data={cardData} />
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
                    <FormLabel>Brand Name:</FormLabel>
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
              {/* Product Name */}
              {prods ? (
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!prodLoading &&
                            !isError &&
                            prods.data.products.data.map((x: any) => (
                              <SelectItem value={x.id} key={x.id}>
                                {x.product_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <Alert
                  variant="warn"
                  className="flex justify-center items-center"
                >
                  <TriangleAlertIcon />
                  <AlertDescription>
                    Please select a brand first
                  </AlertDescription>
                </Alert>
              )}

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price:</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Available in stock:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description:</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Confirm product</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
