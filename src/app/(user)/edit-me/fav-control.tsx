/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const storeOptions = [
  "Amazon",
  "eBay",
  "Walmart",
  "Target",
  "Best Buy",
  "AliExpress",
];
const brandOptions = ["Apple", "Samsung", "Sony", "LG", "Nike", "Adidas"];

// Zod Schema
const formSchema = z.object({
  favStores: z
    .array(z.string().min(1, "Please select a store"))
    .length(6, "Exactly 6 stores required"),
  favBrands: z
    .array(z.string().min(1, "Please select a brand"))
    .length(6, "Exactly 6 brands required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function FavControl() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favStores: Array(6).fill(""),
      favBrands: Array(6).fill(""),
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("Form Data: ", data);
  };
  if (true) {
    return <></>;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 col-span-2 gap-6"
      >
        {/* Favorite Stores */}
        <div className="flex flex-col gap-4">
          <FormLabel>Favorite Stores</FormLabel>
          {Array.from({ length: 6 }).map((_, index) => (
            <FormField
              key={index}
              control={control}
              name={`favStores.${index}`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a store" />
                      </SelectTrigger>
                      <SelectContent>
                        {storeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Favorite Brands */}
        <div className="flex flex-col gap-4">
          <FormLabel>Favorite Brands</FormLabel>
          {Array.from({ length: 6 }).map((_, index) => (
            <FormField
              key={index}
              control={control}
              name={`favBrands.${index}`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brandOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <button
          type="submit"
          className="mt-4 bg-primary text-white rounded px-4 py-2 w-fit"
        >
          Submit
        </button>
      </form>
    </Form>
  );
}
