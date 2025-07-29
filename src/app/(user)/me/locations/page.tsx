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
import { CheckIcon, Loader2Icon, Trash2Icon } from "lucide-react";

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
import { useGetSubscriptionDetailsQuery } from "@/redux/features/store/SubscriptionApi";
import { toast } from "sonner";
import {
  useCancelConnectMutation,
  useCreateConnectMutation,
  useGetLocationsQuery,
} from "@/redux/features/others/otherApi";
import { useUser } from "@/context/userContext";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}
const formSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  address: z.string().min(1, "Address is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  country_id: z.string().min(1, "Country is required"),
  region_id: z.string().min(1, "Region is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export default function Page() {
  const my = useUser();
  const [selectedLocationData, setSelectedLocationData] =
    useState<LocationData | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );

  const [deleteLocation] = useCancelConnectMutation();
  const { data, isLoading } = useGetLocationsQuery();
  const [regions, setRegions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();
  const [createLocation] = useCreateConnectMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: "",
      address: "",
      country_id: "",
      region_id: "",
      latitude: "",
      longitude: "",
      zip_code: "",
    },
  });

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    form.setValue("country_id", countryId);
    form.setValue("region_id", ""); // Reset region when country changes

    const selectedCountry = countriesResponse?.data?.find(
      (c: any) => c.id.toString() === countryId
    );
    setRegions(selectedCountry?.regions || []);
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

    try {
      const body = {
        branch_name: values.storeName,
        user_id: my.id,
        address: values.address,
        region_id: values.region_id,
        latitude: values.latitude,
        longtitude: values.longitude,
        zip_code: values.zip_code,
        plan_id: 7,
      };
      // You need to pass the body to the mutation
      const call = await createLocation(body).unwrap();
      if (call?.ok) {
        toast.success("Success!", {
          description: "Location creation request sent to admin successfully!",
        });
        // Optionally close the dialog or reset the form
        setStep(0); // Reset step if you want to allow adding another
        form.reset(); // Reset form fields
      } else {
        toast.error(call?.message || "Failed to create location!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
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
                {step === 0 ? (
                  <>
                    <FormField
                      control={form.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input placeholder={my.full_name} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4 w-full">
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

                      <FormField
                        control={form.control}
                        name="zip_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                                {countriesResponse?.data?.map(
                                  (country: any) => (
                                    <SelectItem
                                      key={country.id}
                                      value={country.id.toString()}
                                    >
                                      {country.name}
                                    </SelectItem>
                                  )
                                )}
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
                              disabled={
                                !selectedCountryId || regions.length === 0
                              }
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

                    <Button
                      type="button"
                      onClick={() => {
                        // Validate current step before moving to next
                        form
                          .trigger([
                            "storeName",
                            "address",
                            "zip_code",
                            "country_id",
                            "region_id",
                          ])
                          .then((isValid) => {
                            if (isValid) {
                              setStep(1);
                            } else {
                              toast.error(
                                "Please fill in all required fields."
                              );
                            }
                          });
                      }}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <Subscription />
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dummy Table */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.data?.map((x: any, i: any) => (
                <TableRow key={i}>
                  <TableCell>#{x.id}</TableCell>
                  <TableCell className="font-semibold">
                    {x.branch_name}
                  </TableCell>
                  <TableCell>{x.address.address}</TableCell>
                  <TableCell>
                    {x.is_active ? (
                      <Badge variant={"success"}>Active</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Inctive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this location?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          This action will permanently remove the location and
                          cannot be undone. Please confirm if you wish to
                          proceed.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                const call: any = await deleteLocation({
                                  id: x.id,
                                });
                                if (!call.ok) {
                                  toast.error(
                                    call.data.message ?? "Can't be Deleted"
                                  );
                                } else {
                                  toast.success(
                                    call.message ??
                                      "Successfully Deleted Location"
                                  );
                                }
                              } catch {
                                // console.error(error);
                                toast.error("Can't be Deleted");
                              }
                            }}
                          >
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </section>
  );
}

const Subscription = () => {
  // Fetch subscription and add-on data
  const { data: subscriptionDetails, isLoading: isLoadingSubscription } =
    useGetSubscriptionDetailsQuery({ type: "store" });
  // --- Memoized Data Extraction ---
  const subscription = subscriptionDetails?.data?.[0];
  console.log(subscriptionDetails);
  if (isLoadingSubscription) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  return (
    <>
      <section className="w-full rounded-lg bg-white border-2 border-solid border-blue-600 p-6 md:p-8 relative my-6">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          BUSINESS PLAN
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
          {/* Left Side */}
          <div className="flex flex-col">
            <b className="text-lg text-blue-600">{subscription.name}</b>
            <p className="mt-2 text-base text-zinc-500">
              {subscription.description}
            </p>
            <div className="mt-4 text-4xl md:text-6xl font-semibold text-black">
              ${parseFloat(subscription.price).toFixed(0)}/month
            </div>
            <p className="mt-1 text-sm text-zinc-500">Per location</p>
          </div>
          {/* Right Side */}
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
            <h3 className="font-semibold text-base">Included Features:</h3>
            <ul className="mt-4 space-y-4 text-sm">
              {/* Original detailed features can be re-added here if API features are supplementary */}
              {subscription.features && subscription.features.length > 0 ? (
                subscription.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="flex-1">{feature}</span>
                  </li>
                ))
              ) : (
                <p className="text-zinc-500">
                  No features listed for this plan.
                </p>
              )}
            </ul>
          </div>
        </div>
      </section>
      <div className="mt-12 flex justify-end items-center">
        <Button type="submit">Accept & Submit Location</Button>
      </div>
    </>
  );
};
