"use client";

import React, { useEffect } from "react";
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

import ProductCard from "@/components/core/product-card";

import { useBtbProductPricingMutation } from "@/redux/features/b2b/btbApi";
import { toast } from "sonner";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  useProductDetailsByIdRoleQuery,
  useStoreProductDetailsByIdQuery,
} from "@/redux/features/Trending/TrendingApi";
import { useUser } from "@/context/userContext";

// --- Schema ---
const productSchema = z.object({
  productId: z.string().min(1),
  price: z.string().min(1, "Price is required"),
  moq: z.string().min(1, "Minimum Order Quantity is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Page() {
  const navig = useRouter();
  const params = useParams();
  const { role } = useUser();
  const amount = useSearchParams().get("amount");
  const moq = useSearchParams().get("moq");
  useEffect(() => {
    if (amount) {
      form.setValue("price", amount);
    }
    if (moq) {
      form.setValue("moq", moq);
    }
  }, []);
  const productId = params.id as string; // Assuming route is /product/[productId]

  const { data: productData, isLoading } = useProductDetailsByIdRoleQuery(
    { id: productId, role },
    {
      skip: !productId,
    }
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onSubmit",
    defaultValues: {
      productId: productId || "",
      price: "",
      moq: "",
    },
  });

  const [postProduct] = useBtbProductPricingMutation();

  // --- Form Submit ---
  const onSubmit = async (data: ProductFormValues) => {
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
        toast.success("B2B Product initialized successfully!");
        navig.push("/me/manage");
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (productId) {
      form.setValue("productId", productId);
    }
  }, [productId, form]);

  return (
    <div className="py-12!">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product Preview */}
        <div className="order-2 lg:order-1">
          {isLoading ? (
            <div className="w-full aspect-square bg-card border rounded-md flex justify-center items-center text-muted-foreground">
              Loading...
            </div>
          ) : productData?.data ? (
            <ProductCard
              data={{
                title: productData.data.product_name,
                image: productData.data.product_image,
                category: productData.data.role_label,
                note: "",
              }}
              blank
            />
          ) : (
            <div className="w-full aspect-square bg-card border rounded-md flex justify-center items-center text-muted-foreground">
              Product not found.
            </div>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6! order-1 lg:order-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6!">
              {/* Hidden Product ID */}
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
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
