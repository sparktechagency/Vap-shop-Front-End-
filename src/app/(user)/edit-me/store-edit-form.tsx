"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCountysQuery } from "@/redux/features/AuthApi"; // ✅ Added
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
  city: z.string().optional(),
  address: z.string().min(2),
  zip_code: z.string().min(2),
  country_id: z.string(), // ✅ Added
  region_id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  open_from: z.string(),
  close_at: z.string(),
  pl: z.boolean(),
});

interface Country {
  id: string;
  name: string;
  regions: Region[];
}

interface Region {
  id: number;
  name: string;
}

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export default function StoreEditForm({ my }: { my: UserData }) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  // ✅ Added country + region hooks
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();
  const [regions, setRegions] = useState<Region[]>([]);

  const [selectedLocationData, setSelectedLocationData] =
    useState<LocationData | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store_name: my.first_name || "",
      email: my?.email || "",
      phone: my?.phone || "",
      city: my?.address?.city || "",
      address: my?.address?.address || "",
      zip_code: my?.address?.zip_code || "",
      country_id: "", // ✅ Added
      region_id: String(my?.address?.region_id || ""),
      latitude: String(my?.address?.latitude || ""),
      longitude: String(my?.address?.longitude || ""),
      open_from: String(my?.open_from || ""),
      close_at: String(my?.close_at || ""),
      pl: my?.pl === 1 ? true : false,
    },
  });

  const { control, handleSubmit, watch } = form;
  const countryId = watch("country_id");

  // ✅ Auto-populate initial country + region like UserEditForm
  useEffect(() => {
    if (my?.address?.region_id && countriesResponse?.data) {
      const regionId = my.address.region_id;
      const foundCountry = countriesResponse.data.find((country: Country) =>
        country.regions.some(
          (region: Region) => String(region.id) === String(regionId)
        )
      );

      if (foundCountry) {
        form.setValue("country_id", foundCountry.id.toString());
        setRegions(foundCountry.regions);
      }
    }
  }, [my, countriesResponse, form]);

  // handle map location update
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
        {/* Basic Info */}
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
                <Input {...field} readOnly />
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
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
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

        {/* Country & Region */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="country_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedCountry = countriesResponse?.data?.find(
                      (c: Country) => c.id.toString() === value
                    );
                    setRegions(selectedCountry?.regions || []);
                    form.setValue("region_id", "");
                  }}
                  value={field.value}
                  disabled={isLoadingCountries}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countriesResponse?.data?.map((country: Country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!countryId || regions.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Zip, Hours */}
        <FormField
          control={control}
          name="zip_code"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input type="time" {...field} />
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
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2" />

        {/* Location */}
        <div className="col-span-2">
          <LocationPicker onLocationSelect={setSelectedLocationData} />
        </div>

        {!my.address?.latitude && (
          <Alert variant="warn" className="col-span-2">
            <TriangleAlertIcon />
            <AlertTitle>No Location Set</AlertTitle>
            <AlertDescription>
              You haven’t set an exact location yet. Without it, your store
              won’t appear on the map.
            </AlertDescription>
          </Alert>
        )}

        <Card className="col-span-2">
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
