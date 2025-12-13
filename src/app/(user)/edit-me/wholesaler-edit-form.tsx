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
import { BadgePercentIcon, BikeIcon, Loader2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCountysQuery } from "@/redux/features/AuthApi";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

// --- UPDATED: Schema with country_id ---
const formSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
  address: z.string().min(2),
  zip_code: z.string().min(2),
  country_id: z.string(), // ADDED
  region_id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  open_from: z.string(),
  close_at: z.string(),
  tax_percentage: z.string().optional(),
  shipping_cost: z.string().optional(),
});

// --- ADDED: Interfaces for type safety ---
interface Country {
  id: string;
  name: string;
  regions: Region[];
}
interface Region {
  id: number;
  name: string;
}

export default function BrandEditForm({ my }: { my: UserData }) {
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();
  const [regions, setRegions] = useState<Region[]>([]);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // --- UPDATED: Default values to include country_id ---
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      zip_code: "",
      country_id: "",
      region_id: "",
      latitude: "",
      longitude: "",
      open_from: "",
      close_at: "",
      shipping_cost: String(my?.shipping_cost || ""),
      tax_percentage: String(my?.tax_percentage || ""),
    },
  });

  // --- UPDATED: useEffect to handle pre-population of all fields ---
  useEffect(() => {
    if (my) {
      form.setValue("full_name", my?.first_name || "");
      form.setValue("email", my?.email || "");
      form.setValue("phone", my?.phone || "");
      form.setValue("address", my?.address?.address || "");
      form.setValue("zip_code", my?.address?.zip_code || "");
      form.setValue("region_id", String(my?.address?.region_id || ""));
      form.setValue("latitude", String(my?.address?.latitude || ""));
      form.setValue("longitude", String(my?.address?.longitude || ""));
      form.setValue("open_from", String(my?.open_from || ""));
      form.setValue("close_at", String(my?.close_at || ""));

      // Logic to find and set the initial country and corresponding regions
      if (countriesResponse?.data && my?.address?.region_id) {
        const userRegionId = my.address.region_id;
        const initialCountry = countriesResponse.data.find((country: Country) =>
          country.regions.some((region: any) => region.id === userRegionId)
        );

        if (initialCountry) {
          form.setValue("country_id", initialCountry.id.toString());
          setRegions(initialCountry.regions);
        }
      }
    }
  }, [my, countriesResponse, form]);

  const { control, handleSubmit, watch } = form;
  const countryId = watch("country_id");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await updateUser({
        ...values,
        first_name: values.full_name,
      }).unwrap();

      toast.success("Store updated successfully ✅");
    } catch (error: any) {
      const message =
        error?.data?.message || "Something went wrong. Please try again.";

      toast.error(`Update failed ❌ - ${message}`);
      console.error("Update error:", error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          <FormField
            control={control}
            name="full_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Business name</FormLabel>
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
          <div className="col-span-2 space-y-2">
            <Label>City</Label>
            <Input placeholder="Enter your city" />
          </div>
          {/* === START: UPDATED LAYOUT FOR ADDRESS FIELDS === */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name="country_id"
              render={({ field }) => (
                <FormItem>
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
                      <SelectTrigger className="col-span-2 w-full">
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
                      <SelectTrigger className="col-span-2 w-full">
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem
                          key={region.id}
                          value={region.id.toString()}
                        >
                          {region.name}
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
              name="zip_code"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter zip code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* === END: UPDATED LAYOUT === */}

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

          <FormField
            control={control}
            name="open_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open from</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter opening time"
                    type="time"
                    {...field}
                  />
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
                  <Input
                    placeholder="Enter closing time"
                    type="time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>State Tax % (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="tax_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput placeholder="0.00" {...field} />
                        <InputGroupAddon>
                          <BadgePercentIcon />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>B2B Shipping cost (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="shipping_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput placeholder="0.00" />
                        <InputGroupAddon>
                          <BikeIcon />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
      <Separator className="mt-6" />
    </>
  );
}
