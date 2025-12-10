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
import { ArrowRight, BikeIcon, Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useCountysQuery } from "@/redux/features/AuthApi";

const formSchema = z.object({
  brand_name: z.string().min(2),
  email: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
  city: z.string().optional(),
  address: z.string().min(2),
  zip_code: z.string().min(2),
  region_id: z.string(),
  shipping_cost: z.string().optional(),
  country_id: z.string(),
});
export default function BrandEditForm({ my }: { my: UserData }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand_name: my?.first_name || my?.full_name || "",
      email: my?.email || "",
      phone: my?.phone || "",
      city: my?.address?.city || "",
      address: my?.address?.address || "",
      zip_code: my?.address?.zip_code || "",
      region_id: String(my?.address?.region_id || ""),
      shipping_cost: String(my?.shipping_cost || ""),
      country_id: "",
    },
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();
  const [regions, setRegions] = React.useState([]);

  React.useEffect(() => {
    if (my?.address?.region_id && countriesResponse?.data) {
      const regionId = my.address.region_id;

      const foundCountry = countriesResponse.data.find((country: any) =>
        country.regions.some(
          (region: any) => String(region.id) === String(regionId)
        )
      );

      if (foundCountry) {
        form.setValue("country_id", foundCountry.id.toString());
        setRegions(foundCountry.regions);
      }
    }
  }, [my, countriesResponse, form]);

  const { control, handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await updateUser({
        ...values,
        latitude: 0,
        longitude: 0,
      }).unwrap();
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
    <>
      {" "}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          <FormField
            control={control}
            name="brand_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Brand name</FormLabel>
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
          {/* Country & Region */}
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

                      const selected = countriesResponse?.data?.find(
                        (c: any) => c.id.toString() === value
                      );

                      setRegions(selected?.regions || []);
                      form.setValue("region_id", "");
                    }}
                    value={field.value}
                    disabled={isLoadingCountries}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {countriesResponse?.data?.map((country: any) => (
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
                    value={field.value || ""}
                    disabled={!regions.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {regions.map((region: any) => (
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
          </div>

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
                        <InputGroupInput placeholder="0.00" {...field} />
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
      <Card className="w-full mt-6 border border-border shadow-lg rounded-xl">
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
      </Card>
    </>
  );
}
