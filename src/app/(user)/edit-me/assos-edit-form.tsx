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
import { Loader2Icon } from "lucide-react";
import { useCountysQuery } from "@/redux/features/AuthApi"; // ADDED
import { Label } from "@/components/ui/label";

// UPDATED: Schema with country_id and corrected zip_code
const formSchema = z.object({
  first_name: z.string().min(2),
  email: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
  address: z.string().min(2),
  zip_code: z.string().min(2), // RENAMED from zipcode
  country_id: z.string(), // ADDED
  region_id: z.string(),
});

// ADDED: Interfaces for type safety
interface Country {
  id: string;
  name: string;
  regions: Region[];
}
interface Region {
  id: number;
  name: string;
}

export default function UserEditForm({ my }: { my: UserData }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // UPDATED: Default values
    defaultValues: {
      first_name: "",
      email: "",
      phone: "",
      address: "",
      zip_code: "",
      country_id: "",
      region_id: "",
    },
  });

  // ADDED: Hooks for fetching countries and managing regions state
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();
  const [regions, setRegions] = useState<Region[]>([]);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  // UPDATED: useEffect to handle pre-population of country and region
  useEffect(() => {
    if (my) {
      form.setValue("first_name", my?.first_name);
      form.setValue("email", my?.email ?? "");
      form.setValue("phone", my?.phone ?? "");
      form.setValue("address", my?.address?.address ?? "");
      form.setValue("zip_code", my?.address?.zip_code ?? ""); // Corrected field name
      form.setValue("region_id", String(my?.address?.region_id ?? ""));

      // Logic to find and set initial country and regions
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
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          {/* Basic fields */}
          <FormField
            control={control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Association name</FormLabel>
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

          <div className="col-span-2 space-y-2">
            <Label>City</Label>
            <Input placeholder="Enter your city" />
          </div>

          {/* === START: UPDATED LAYOUT FOR COUNTRY/REGION/ZIP === */}

          <FormField
            control={control}
            name="country_id"
            render={({ field }) => (
              <FormItem className="col-span-2 ">
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
          {/* === END: UPDATED LAYOUT === */}

          {/* Submit button */}
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
    </>
  );
}
