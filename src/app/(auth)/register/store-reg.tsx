import React from "react";
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
import { useRegisterMutation } from "@/redux/features/AuthApi";
import { useRouter } from "next/navigation";

interface StoreRegisterFormData {
  first_name: string;
  last_name: string;
  store_name: string;
  brand_name: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  zip_code: string;
  region: string;
  password: string;
  password_confirmation: string;
  role: string;
  terms: boolean;
}

export default function StoreRegister({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StoreRegisterFormData>({
    defaultValues: {
      role: '5',
    },
  });

  const onSubmit = async (data: StoreRegisterFormData) => {
    if (!data.terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      const formattedData = {
        first_name: data.first_name,
        last_name: data.last_name,
        store_name: data.store_name,
        brand_name: data.brand_name,
        dob: new Date(data.dob).toLocaleDateString("en-US"),
        email: data.email,
        phone: data.phone,
        address: data.address,
        zip_code: data.zip_code,
        region: data.region,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
      };
      console.log(formattedData);
      const response = await register(formattedData).unwrap();
      console.log("Registration response:", response);
      if (response?.ok) {
        toast.success(response?.message || "Registration successful!");
        router.push("/verify-otp?isregistared=true");
      } else {
        toast.error(response?.message || "Registration failed!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed. Please try again.");
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
                Register - Store
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        type="text"
                        {...formRegister("first_name", { required: "First name is required" })}
                      />
                      {errors.first_name && (
                        <span className="text-red-500 text-sm">{errors.first_name.message}</span>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        type="text"
                        {...formRegister("last_name", { required: "Last name is required" })}
                      />
                      {errors.last_name && (
                        <span className="text-red-500 text-sm">{errors.last_name.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Store Information */}
                  <div className="grid gap-2">
                    <Label htmlFor="store_name">Store Name</Label>
                    <Input
                      id="store_name"
                      type="text"
                      {...formRegister("store_name", { required: "Store name is required" })}
                    />
                    {errors.store_name && (
                      <span className="text-red-500 text-sm">{errors.store_name.message}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="brand_name">Brand Name</Label>
                    <Input
                      id="brand_name"
                      type="text"
                      {...formRegister("brand_name")}
                    />
                  </div>

                  {/* Address Information */}
                  <div className="grid gap-2">
                    <Label htmlFor="address">Current Address</Label>
                    <Input
                      id="address"
                      type="text"
                      {...formRegister("address", { required: "Address is required" })}
                    />
                    {errors.address && (
                      <span className="text-red-500 text-sm">{errors.address.message}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="zip_code">Zip Code</Label>
                      <Input
                        id="zip_code"
                        type="text"
                        {...formRegister("zip_code")}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        type="text"
                        {...formRegister("region")}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...formRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...formRegister("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+?[0-9]{10,15}$/,
                          message: "Invalid phone number",
                        },
                      })}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-sm">{errors.phone.message}</span>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      {...formRegister("dob", { required: "Date of birth is required" })}
                    />
                    {errors.dob && (
                      <span className="text-red-500 text-sm">{errors.dob.message}</span>
                    )}
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
                      <span className="text-red-500 text-sm">{errors.password.message}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      {...formRegister("password_confirmation", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") || "Passwords don't match",
                      })}
                    />
                    {errors.password_confirmation && (
                      <span className="text-red-500 text-sm">{errors.password_confirmation.message}</span>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="terms"
                      {...formRegister("terms", { required: "You must accept the terms" })}
                    />
                    <Label htmlFor="terms">
                      Accept{" "}
                      <Link href="tnc" className="underline">
                        terms and conditions
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <span className="text-red-500 text-sm">{errors.terms.message}</span>
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