"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCountysQuery, useRegisterMutation } from "@/redux/features/AuthApi";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MembershipInfo from "./membershipinfo";

interface AssosRegisterFormData {
  name: string;
  address: string;
  zip_code: string;
  region_id: string;

  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: string;
  terms: boolean;
}
interface Country {
  id: string;
  name: string;
}
export default function AssosRegister({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [register, { isLoading }] = useRegisterMutation();
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();
  const router = useRouter();
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [regions, setRegions] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AssosRegisterFormData>({
    defaultValues: {
      role: "2", // Assuming 5 is the role for associations
      region_id: "",
    },
  });
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    const selectedCountry = countriesResponse?.data?.find(
      (c: { id: { toString: () => string } }) => c.id.toString() === countryId
    );
    setRegions(selectedCountry?.regions || []);
    setValue("region_id", ""); // Reset region when country changes
  };
  const onSubmit = async (data: AssosRegisterFormData) => {
    if (!data.terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    if (!data.region_id) {
      toast.error("Please select a region");
      return;
    }
    try {
      const [firstName = "", lastName = ""] = data.name?.split(" ") || [];
      const formattedData = {
        first_name: firstName,
        last_name: lastName,
        address: data.address,
        zip_code: data.zip_code,
        region_id: data.region_id,

        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
      };

      const response = await register(formattedData).unwrap();

      if (response?.ok) {
        toast.success(response?.message || "Registration successful!");
        router.push(`/verify-otp?isregistared=true&email=${data.email}`);
      } else {
        toast.error(response?.message || "Registration failed!");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Registration failed. Please try again."
      );
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex w-full items-center justify-center !p-6 md:!p-10">
      <div className="w-full max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Register - Association
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  {/* Association Information */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Association Name</Label>
                    <Input
                      id="name"
                      type="text"
                      {...formRegister("name", {
                        required: "Association name is required",
                      })}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Address Information */}
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      {...formRegister("address", {
                        required: "Address is required",
                      })}
                    />
                    {errors.address && (
                      <span className="text-red-500 text-sm">
                        {errors.address.message}
                      </span>
                    )}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4 w-full">
                    <div className="grid gap-2 w-full">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        onValueChange={handleCountryChange}
                        disabled={isLoadingCountries}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
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
                    </div>
                    <div className="grid gap-2 w-full">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        onValueChange={(value) => setValue("region_id", value)}
                        disabled={!selectedCountryId || regions.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              regions.length
                                ? "Select region"
                                : "Select country first"
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
                      </Select>
                      {errors.region_id && (
                        <span className="text-red-500 text-sm">
                          Please select a region
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zip_code">Zip Code</Label>
                    <Input
                      id="zip_code"
                      type="text"
                      {...formRegister("zip_code")}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...formRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" {...formRegister("phone")} />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...formRegister("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    {errors.password && (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">
                      Confirm Password
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      {...formRegister("password_confirmation", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords don't match",
                      })}
                    />
                    {errors.password_confirmation && (
                      <span className="text-red-500 text-sm">
                        {errors.password_confirmation.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 gap-2 hidden">
                    <Label>Select Membership</Label>
                    <div className="w-full flex justify-between items-center gap-6">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="FREE MEMBERSHIP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">FREE MEMBERSHIP</SelectItem>
                          <SelectItem value="advocacy">
                            CASAA Advocacy Business Add‑On
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <MembershipInfo />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="terms"
                      {...formRegister("terms", {
                        required: "You must accept the terms",
                      })}
                    />
                    <Label htmlFor="terms">
                      Accept{" "}
                      <Link href="tnc" className="underline">
                        terms and conditions
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <span className="text-red-500 text-sm">
                      {errors.terms.message}
                    </span>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create an account"}
                  </Button>
                </div>

                <div className="!mt-4 text-center text-sm">
                  Have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
