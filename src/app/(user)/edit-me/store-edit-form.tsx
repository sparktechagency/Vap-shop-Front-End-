/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
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

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserData } from "@/lib/types/apiTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserMutation } from "@/redux/features/users/userApi";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import LocationPicker from "@/components/core/location-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  store_name: z.string().min(2),
  email: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
  address: z.string().min(2),
  zipcode: z.string().min(2),
  region_id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});
interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export default function StoreEditForm({ my }: { my: UserData }) {
  const [selectedLocationData, setSelectedLocationData] =
    useState<LocationData | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store_name: "",
      email: "",
      phone: "",
      address: "",
      zipcode: "",
      region_id: "",
    },
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    form.setValue("store_name", my.first_name);
    form.setValue("email", my?.email ?? "");
    form.setValue("phone", my?.phone ?? "");
    form.setValue("address", my?.address?.address ?? "");
    form.setValue("zipcode", my?.address?.zip_code ?? "");
    form.setValue("region_id", String(my?.address?.region_id ?? ""));
    form.setValue("latitude", String(my?.address?.latitude ?? ""));
    form.setValue("longitude", String(my?.address?.longitude ?? ""));
  }, []);

  // 📍 Set lat/lng dynamically when location is picked
  useEffect(() => {
    if (selectedLocationData) {
      const { lat, lng, address } = selectedLocationData;
      form.setValue("latitude", String(lat));
      form.setValue("longitude", String(lng));
      form.setValue(
        "address",
        address?.split(",").slice(0, 3).join(",") ?? form.getValues("address")
      );
    }
  }, [selectedLocationData]);

  const { control, handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await updateUser(values).unwrap();

      toast.success("User updated successfully ✅");
      console.log("User update response:", res);
    } catch (error: any) {
      const message =
        error?.data?.message || "Something went wrong. Please try again.";

      toast.error(`Update failed ❌ - ${message}`);
      console.error("Update error:", error);
    }
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
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} disabled />
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
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter zip code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="region_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Canada</SelectItem>
                    <SelectItem value="2">US</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2" />
        <div className="col-span-2">
          <LocationPicker
            onLocationSelect={(locationData) => {
              console.log("Selected location:", locationData);
              setSelectedLocationData(locationData);
            }}
          />
        </div>
        {selectedLocationData && (
          <Card className="w-full hidden">
            <CardHeader>
              <CardTitle className="text-lg">Selected Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3!">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Coordinates
                </p>
                <p className="font-mono text-sm">
                  {selectedLocationData.lat.toFixed(6)},{" "}
                  {selectedLocationData.lng.toFixed(6)}
                </p>
              </div>
              {selectedLocationData.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p className="text-sm">
                    {selectedLocationData.address
                      .split(",")
                      .slice(0, 2)
                      .join(",")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {/* Submit button */}
        <FormField
          control={control}
          name="latitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="longitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
