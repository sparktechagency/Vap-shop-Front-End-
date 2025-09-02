/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { Separator } from "@/components/ui/separator";
import { Label } from "recharts";
import { useCountysQuery } from "@/redux/features/AuthApi";

const formSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
  address: z.string().min(2),
  zip_code: z.string().min(2),
  region_id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  open_from: z.string(),
  close_at: z.string(),
});
export default function BrandEditForm({ my }: { my: UserData }) {
  console.log('my', my);
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();

  const [selectedCountryId, setSelectedCountryId] = React.useState<string>("");
  const [regions, setRegions] = React.useState<any[]>([]);

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    const selectedCountry = countriesResponse?.data?.find(
      (c: { id: { toString: () => string } }) => c.id.toString() === countryId
    );
    setRegions(selectedCountry?.regions || []);

  };


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: my?.first_name || "",
      email: my?.email || "",
      phone: my?.phone || "",
      address: my?.address?.address || "",
      zip_code: my?.address?.zip_code || "",
      region_id: String(my?.address?.region_id || ""),
      latitude: String(my?.address?.latitude || ""),
      longitude: String(my?.address?.longitude || ""),
      open_from: String(my?.open_from || ""),
      close_at: String(my?.close_at || ""),
    },
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { control, handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('values', values);

    try {
      const res = await updateUser({
        ...values,
        first_name: values.full_name,
      }).unwrap();

      toast.success("Store updated successfully ✅");
      console.log(" update response:", res);
    } catch (error: any) {
      const message =
        error?.data?.message || "Something went wrong. Please try again.";

      toast.error(`Update failed ❌ - ${message}`);
      console.error("Update error:", error);
    }
  }

  return (
    <>
      {" "}
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


          <FormField
            control={control}
            name="region_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
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

          {/* <Label >Region</Label>
          <Select
            onValueChange={(value) => setValue("region_id", value)}
            disabled={!selectedCountryId || regions.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  regions.length
                    ? "Select state"
                    : "Select state first"
                }
              />
            </SelectTrigger>
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
          </Select> */}


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
      {/* <Card className="w-full mt-6 border border-border shadow-lg rounded-xl">
        <CardHeader className="space-y-2 p-6">
          <CardTitle className="text-2xl font-bold text-foreground">
            Send Ad Request to Admin
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your brand will be featured in Trending (Most Followers tab).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Button
            asChild
            className="w-full py-6 text-lg font-semibold rounded-lg"
          >
            <Link
              href={"/me/ad"}
              className="flex items-center justify-center gap-2"
            >
              Make an Ad request
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card> */}
    </>
  );
}
