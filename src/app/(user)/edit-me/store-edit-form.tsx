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
import { Loader2Icon, TriangleAlertIcon } from "lucide-react";
import LocationPicker from "@/components/core/location-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  store_name: z.string().min(2),
  email: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
  address: z.string().min(2),
  zip_code: z.string().min(2),
  region_id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  open_from: z.string(),
  close_at: z.string(),
  // ein: z.string(),
  pl: z.boolean(),
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
      store_name: my.first_name || "",
      email: my?.email || "",
      phone: my?.phone || "",
      address: my?.address?.address || "",
      zip_code: my?.address?.zip_code || "",
      region_id: String(my?.address?.region_id || "0"),
      latitude: String(my?.address?.latitude || ""),
      longitude: String(my?.address?.longitude || ""),
      open_from: String(my?.open_from || ""),
      close_at: String(my?.close_at || ""),
      // ein: String(my?.ein || ""),
      pl: my?.pl === 1 ? true : false,
    },
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  useEffect(() => {
    if (my?.address?.latitude && my?.address?.longitude) {
      setSelectedLocationData({
        lat: parseFloat(my?.address?.latitude),
        lng: parseFloat(my?.address?.longitude),
      });
    }
  }, []);

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

      toast.success("Store updated successfully ✅");
      console.log("Store update response:", res);
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
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} readOnly />
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
        {/* {String(my.role) === "3" ||
          (String(my.role) === "5" && (
            <FormField
              control={control}
              name="ein"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>EIN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your EIN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))} */}
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
          name="zip_code"
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
                  value={String(field.value) || "0"}
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
        <FormField
          control={control}
          name="open_from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Open from</FormLabel>
              <FormControl>
                <Input placeholder="Enter zip code" type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="close_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Closed at</FormLabel>
              <FormControl>
                <Input placeholder="" type="time" {...field} />
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
        {!my.address?.latitude && (
          <Alert variant={"warn"} className="col-span-2">
            <TriangleAlertIcon />
            <AlertTitle>No Location Set</AlertTitle>
            <AlertDescription>
              You haven’t set an exact location on the map yet. Without it, your
              profile won’t appear in the map section.
            </AlertDescription>
          </Alert>
        )}
        {my.address?.latitude && my.address?.longitude && (
          <div className="p-4 grid grid-cols-2 gap-6 rounded-md border text-sm">
            <div className="col-span-2 border-b pb-2 font-bold">
              {my.full_name}&apos;s Map Location:
            </div>
            <div className="">
              <span className="font-semibold">Latitute:</span>{" "}
              {my.address.latitude}
            </div>
            <div className="">
              <span className="font-semibold">Longtitude:</span>{" "}
              {my.address.longitude}
            </div>
          </div>
        )}
        <Card className="rounded-md shadow-none">
          <CardContent>
            {["5"].includes(String(my.role)) && (
              <FormField
                control={control}
                name="pl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participating Locations</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2 mt-4">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="participating-locations"
                        />
                        <Label htmlFor="participating-locations">
                          {field.value ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

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
