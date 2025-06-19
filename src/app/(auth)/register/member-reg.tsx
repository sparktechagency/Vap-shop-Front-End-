/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRegisterMutation } from "@/redux/features/AuthApi";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  password_confirmation: string;
  role: string;
  terms: boolean;
}

export default function MemberRegister({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: "2",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.terms) {
      toast.error("Please accept the terms and conditions");
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
                <div className="grid grid-cols-2 gap-6">
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
                      required
                      {...formRegister("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+?[0-9]{10,15}$/,
                          message: "Invalid phone number",
                        },
                      })}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-sm">
                        {errors.phone.message}
                      </span>
                    )}
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
                      <Link href="tnc" className="underline">
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
