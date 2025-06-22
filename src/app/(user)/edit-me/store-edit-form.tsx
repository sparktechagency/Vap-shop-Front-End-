"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  store_name: z.string().min(2),
  email: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
  favBrands: z.array(z.string().min(1)).length(6),
  favStores: z.array(z.string().min(1)).length(6),
});

export default function StoreEditForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store_name: "",
      email: "",
      phone: "",
      favBrands: Array(6).fill(""),
      favStores: Array(6).fill(""),
    },
  });

  const { control, handleSubmit } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // favBrands and favStores are arrays of 6 selected strings
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        {/* Basic fields */}
        <FormField
          control={control}
          name="store_name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Store name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your store name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your phone number"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2" />

        {/* Submit button */}
        <div className="col-span-2">
          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
