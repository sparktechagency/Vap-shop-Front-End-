"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCountysQuery } from "@/redux/features/AuthApi";
import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";
import { notFound, useSearchParams } from "next/navigation";
import { useTrendAdProductMutation } from "@/redux/features/manage/product";
import { toast } from "sonner";

const FormSchema = z.object({
  preferred_duration: z.enum(["1_week", "2_weeks", "3_weeks", "4_weeks"]),
  amount: z.string().min(1, "Amount is required"),
  category_id: z.string().min(1, "Select a category"),
  region_id: z.string().min(1, "Select a region"),
});

export default function Page() {
  const PRODUCT_ID = useSearchParams().get("id");
  const [selectedSlot, setSelectedSlot] = useState(1);
  const { data: countryData, isLoading: isRegionsLoading } = useCountysQuery();
  const { data: cats, isLoading: isCatsLoading } = useGetallCategorysQuery();
  const [prodAdRequest] = useTrendAdProductMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      preferred_duration: undefined,
      amount: "0",
      category_id: "",
      region_id: "",
    },
    mode: "onChange",
  });
  // const {} =
  if (!PRODUCT_ID) {
    return notFound();
  }
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const payload = {
      product_id: PRODUCT_ID,
      preferred_duration: values.preferred_duration,
      amount: values.amount,
      slot: String(selectedSlot), // string instead of number
      category_id: values.category_id,
      region_id: values.region_id,
    };
    try {
      const res: any = await prodAdRequest(payload).unwrap();

      if (!res.ok) {
        toast.error(res.message ?? "Failed to complete this request");
      } else {
        toast.success(res.message ?? "Successfully created ad request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="pt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Post An Advertisement Request
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => {
            const idx = i + 1;
            const isActive = selectedSlot === idx;
            return (
              <Card className="w-full aspect-square" key={idx}>
                <CardHeader>
                  <CardTitle>Slot {idx}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 w-full flex justify-center items-center">
                  <Button
                    disabled={isActive}
                    onClick={() => setSelectedSlot(idx)}
                    variant={isActive ? "outline" : "default"}
                  >
                    {isActive ? "Selected Slot" : "Select Slot"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <div className="w-full">
        <h3 className="font-semibold text-sm">Description:</h3>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere sit
          ad laboriosam ullam aut quos nemo? Labore molestiae cupiditate, et
          voluptates rerum.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Row: Amount + Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferred_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1_week">1 week</SelectItem>
                      <SelectItem value="2_weeks">2 weeks</SelectItem>
                      <SelectItem value="1_month">1 month</SelectItem>
                      <SelectItem value="3_months">3 months</SelectItem>
                      <SelectItem value="6_months">6 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row: Product (fixed), Category, Region, Submit */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <FormItem>
                <FormLabel>Product ID</FormLabel>
                <FormControl>
                  <Input value={PRODUCT_ID ?? ""} readOnly disabled />
                </FormControl>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v)}
                    value={field.value ? String(field.value) : undefined}
                    disabled={isCatsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isCatsLoading ? "Loading..." : "Select Category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isCatsLoading &&
                        cats?.data?.map((x: any) => (
                          <SelectItem value={String(x.id)} key={x.id}>
                            {x.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region_id"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Region</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v)}
                    value={field.value ? String(field.value) : undefined}
                    disabled={isRegionsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isRegionsLoading ? "Loading..." : "Select Region"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isRegionsLoading &&
                        countryData?.data?.flatMap((ctr: any) =>
                          ctr.regions.map((r: any) => (
                            <SelectItem value={String(r.id)} key={r.id}>
                              {r.name} ({r.code}), {ctr.name}
                            </SelectItem>
                          ))
                        )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-1 flex items-end">
              <Button type="submit" className="w-full">
                Submit Ad Request
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
