
"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useUpdateinteractionMutation } from "@/redux/features/admin/AdminApis";
import { useProductDetailsByIdRoleQuery } from "@/redux/features/Trending/TrendingApi";



type HeartsFormValues = {
  targetType: string; // 'brand', 'wholesaler', 'store'
  url: string;
  heartCount: number;
};

// Helper: Extract ID (e.g., 176) from URL
const extractIdFromUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const match = url.match(/\/(\d+)(\?|$)/); // Matches number before ? or end of string
    return match ? match[1] : null;
  } catch (e) {
    console.log('e', e);
    return null;
  }
};

// Helper: Map string type to Role ID
const getRoleId = (type: string): number => {
  switch (type) {
    case "brand": return 3;
    case "wholesaler": return 4;
    case "shop": return 5; // Assuming 'shop' matches 'STORE' = 5
    default: return 3; // Default to Brand
  }
};

export default function Hearts() {
  const [updateInteraction, { isLoading: isUpdating }] = useUpdateinteractionMutation();

  const form = useForm<HeartsFormValues>({
    defaultValues: {
      targetType: "", // Default to Brand (Role 3)
      url: "",
      heartCount: 0,
    },
  });

  // 1. WATCH: Monitor Input Fields
  const watchedUrl = form.watch("url");
  const watchedType = form.watch("targetType");

  // 2. EXTRACT: Get ID immediately
  const extractedId = useMemo(() => extractIdFromUrl(watchedUrl), [watchedUrl]);

  // 3. AUTO-FETCH: Fetch Product Details based on ID + Role
  const {
    data: productData,
    isLoading: isFetchingProduct
  } = useProductDetailsByIdRoleQuery(
    {
      id: String(extractedId),
      role: getRoleId(watchedType) // Dynamically pass 3, 4, or 5
    },
    {
      skip: !extractedId, // Skip if no ID extracted
    }
  );

  const onSubmit = async (values: HeartsFormValues) => {
    if (!extractedId) {
      toast.error("Please provide a valid URL containing an ID.");
      return;
    }

    try {
      await updateInteraction({
        target_id: extractedId,
        target_type: values.targetType, // We are hearting a product
        metric_type: "heart",
        count: Number(values.heartCount),
      }).unwrap();

      const productName = productData?.data?.product_name || "Product";
      toast.success(`Hearts updated successfully for ${productName}`);
      form.reset({
        ...values,
        url: "",
        heartCount: 0,
      });
    } catch (error) {
      toast.error("Failed to update hearts.");
      console.error(error);
    }
  };

  const product = productData?.data;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Hearts</h2>
      <p className="text-gray-600 mb-6">
        Paste a product link, select the owner type, and update heart counts.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="targetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Owner Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="brand">Brand </SelectItem>
                      <SelectItem value="wholesaler">Wholesaler </SelectItem>
                      <SelectItem value="shop">Store/Shop </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heartCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Count</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="e.g. 500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://.../product/10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- AUTOMATIC PREVIEW SECTION --- */}
          <div className="min-h-[100px] transition-all duration-300">
            {/* Loading State */}
            {isFetchingProduct && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 border rounded-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            )}

            {/* Success State */}
            {!isFetchingProduct && product && (
              <div className="flex items-start p-4 bg-white border border-gray-200 shadow-sm rounded-lg animate-in fade-in slide-in-from-top-2">
                {/* Product Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg line-clamp-1">
                        {product.product_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Category: {product.category?.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">
                      ❤️ {product.total_heart} Hearts
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={product.user?.avatar} />
                      <AvatarFallback>{product.user?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span>Owned by: <span className="font-semibold">{product.user?.full_name}</span></span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {product.user?.role_label}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error/Empty State */}
            {!isFetchingProduct && extractedId && !product && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex flex-col gap-1">
                <div className="font-semibold flex items-center gap-2">
                  <span>⚠️</span> Product not found
                </div>
                <p>
                  Checked ID: <strong>{extractedId}</strong> with Role: <strong>{getRoleId(watchedType)} ({watchedType})</strong>.
                  <br />
                  Try changing the Product Owner Type dropdown if the ID is correct.
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isUpdating || !product}
          >
            {isUpdating ? "Updating..." : "Confirm & Update"}
          </Button>
        </form>
      </Form>
    </>
  );
}