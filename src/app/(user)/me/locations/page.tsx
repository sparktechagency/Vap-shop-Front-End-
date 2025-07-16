/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";

import React, { useEffect, useState } from "react";
import LocationPicker from "@/components/core/location-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountysQuery } from "@/redux/features/AuthApi";

// -----------------------------------
// Dummy data and types — replace with API
// -----------------------------------

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

const formSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  address: z.string().min(1, "Address is required"),
  country_id: z.string().min(1, "Country is required"),
  region_id: z.string().min(1, "Region is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export default function Page() {
  const [selectedLocationData, setSelectedLocationData] =
    useState<LocationData | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );
  const [regions] = useState<any[]>([]);

  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: "",
      address: "",
      country_id: "",
      region_id: "",
      latitude: "",
      longitude: "",
    },
  });

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    form.setValue("country_id", countryId);
    form.setValue("region_id", "");

    // setRegions(selectedCountry?.regions || []);
  };

  useEffect(() => {
    if (selectedLocationData) {
      const { lat, lng, address } = selectedLocationData;
      form.setValue("latitude", String(lat));
      form.setValue("longitude", String(lng));
      form.setValue("address", address?.split(",").slice(0, 3).join(",") ?? "");
    }
  }, [selectedLocationData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted values:", values);
  }

  return (
    <section className="border-t p-6">
      <h1 className="text-center text-3xl font-semibold mb-6">
        Manage Connected Locations
      </h1>

      <div className="py-6 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add a new Location</Button>
          </DialogTrigger>
          <DialogContent className="min-w-[60dvw]">
            <DialogHeader className="border-b pb-4">
              <DialogTitle>Add a new location</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Store Name */}
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Vapex Smokehouse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country and Region */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="country_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            handleCountryChange(val);
                          }}
                          value={field.value}
                          disabled={isLoadingCountries}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countriesResponse.data.map((country: any) => (
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
                    control={form.control}
                    name="region_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedCountryId || regions.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  regions.length
                                    ? "Select region"
                                    : "Select country first"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem
                                key={region.id}
                                value={region.id.toString()}
                              >
                                {region.name} ({region.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location Picker */}
                <LocationPicker
                  onLocationSelect={(locationData) => {
                    setSelectedLocationData(locationData);
                  }}
                />

                {/* Hidden Fields */}
                <div className="hidden">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input readOnly {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input readOnly {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Save Location</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dummy Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Store Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#345</TableCell>
            <TableCell className="font-semibold">VODOO VAPERS</TableCell>
            <TableCell>New York City, New York</TableCell>
            <TableCell>United States</TableCell>
            <TableCell>
              <Button variant="outline" size="icon">
                <Trash2Icon className="text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
