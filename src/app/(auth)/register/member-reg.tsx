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
import { useCountysQuery, useRegisterMutation } from "@/redux/features/AuthApi";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MembershipInfo from "./membershipinfo";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  zip_code: string;
  region_id: string;
  password: string;
  password_confirmation: string;
  role: string;
  terms: boolean;
}
interface Country {
  id: string;
  name: string;
}
export default function MemberRegister({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountysQuery();

  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [regions, setRegions] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: "6",
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
  const onSubmit = async (data: RegisterFormData) => {
    if (!data.terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    if (!data.region_id) {
      toast.error("Please select a region");
      return;
    }
    try {
      const formattedData = {
        first_name: data.first_name,
        last_name: data.last_name,
        dob: new Date(data.dob).toLocaleDateString("en-US"),
        email: data.email,
        phone: data.phone,
        address: data.address,
        zip_code: data.zip_code,
        region_id: data.region_id,

        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
      };

      const response = await register(formattedData).unwrap();

      if (response?.ok) {
        toast.success(response?.message || "Registration successful!");
        router.push("/verify-otp?isregistared=true");
        reset({
          first_name: "",
          last_name: "",
          dob: "",
          email: "",
          phone: "",
          address: "",
          zip_code: "",
          region_id: "",

          password: "",
          password_confirmation: "",
          role: "2",
          terms: false,
        });
      } else {
        toast.error(response?.message || "Registration failed!");
      }
    } catch (err: any) {
      const message =
        err?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex w-full items-center justify-center !p-6 md:!p-10">
      <div className="w-full max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Register - Member
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="lg:grid lg:grid-cols-2 gap-6 space-y-6 lg:space-y-0">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      type="text"
                      required
                      {...formRegister("first_name", {
                        required: "First name is required",
                      })}
                    />
                    {errors.first_name && (
                      <span className="text-red-500 text-sm">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      type="text"
                      required
                      {...formRegister("last_name", {
                        required: "Last name is required",
                      })}
                    />
                    {errors.last_name && (
                      <span className="text-red-500 text-sm">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="dob">Date of birth</Label>
                    </div>
                    <Input
                      id="dob"
                      type="date"
                      required
                      {...formRegister("dob", {
                        required: "Date of birth is required",
                      })}
                    />
                    {errors.dob && (
                      <span className="text-red-500 text-sm">
                        {errors.dob.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="address">Address</Label>
                    </div>
                    <Input
                      id="address"
                      type="text"
                      required
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

                  <div className="grid lg:grid-cols-2 gap-4 w-full ">
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

                  <div className="col-span-2 grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      required
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
                  <div className="col-span-2 grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="phone">Phone number</Label>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      {...formRegister("phone", {})}
                    />
                  </div>
                  <div className="col-span-2 grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
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
                  <div className="col-span-2 grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password_confirmation">
                        Confirm Password
                      </Label>
                    </div>
                    <Input
                      id="password_confirmation"
                      type="password"
                      required
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
                  <div className="col-span-2 hidden gap-2">
                    <Label>Select Membership</Label>
                    <div className="w-full flex justify-between items-center gap-6">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="FREE MEMBERSHIP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">FREE MEMBERSHIP</SelectItem>
                          <SelectItem value="advocacy">
                            ADVOCACY CHAMPION MEMBERSHIP
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <MembershipInfo member />
                    </div>
                  </div>
                  <div className=""></div>
                  <div className="flex flex-row justify-end items-center gap-2">
                    <Checkbox
                      id="terms"
                      {...formRegister("terms", {
                        required: "You must accept the terms",
                      })}
                    />
                    <Label htmlFor="terms">
                      Accept{" "}
                      <Link href="/legal/privacy?type=terms-of-service" className="underline">
                        terms and conditions
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <span className="text-red-500 text-sm col-span-2">
                      {errors.terms.message}
                    </span>
                  )}
                  <div className="col-span-2 flex flex-row justify-center items-center">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create an account"}
                    </Button>
                  </div>
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
