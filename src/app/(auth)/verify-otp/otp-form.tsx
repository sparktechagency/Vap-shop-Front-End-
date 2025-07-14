/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useResendotpMutation, useVerifyemailMutation } from "@/redux/features/AuthApi";
import { useRouter, useSearchParams } from "next/navigation";

interface OTPFormData {
  otp: string;
}

export function OTPForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const isFromRegistration = searchParams?.get("isregistared");
  const [verifyEmail, { isLoading }] = useVerifyemailMutation();
  const [resendotp, { isLoading: isResendLoading }] = useResendotpMutation();
  const router = useRouter();
  console.log('email', email);
  console.log(isFromRegistration);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPFormData>();

  // onSubmit function...
  const onSubmit = async (data: OTPFormData) => {
    try {
      const response = await verifyEmail({ otp: data.otp }).unwrap();

      if (response.ok) {
        Cookies.set("token", response.data.access_token);
        if (isFromRegistration === "true") {
          toast.success(response.message || "Verification successful! Welcome.");
          router.push("/");
        } else {
          toast.success(
            response.message || "Email verified. You can now reset your password."
          );
          router.push("/reset-password");
        }
      } else {
        toast.error(response.message || "Verification failed");
      }
    } catch (error: any) {
      toast.error(
        error.data?.message || "Verification failed. Please try again."
      );
      console.error("Verification error:", error);
    }
  };


  const handleResendOtp = async () => {
    try {
      const response = await resendotp({ email }).unwrap();
      console.log("Resend OTP response:", response);
      if (response.ok) {
        toast.success(response.message || "OTP sent successfully!");
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(
        error.data?.message || "Failed to send OTP. Please try again."
      );
      console.error("Resend OTP error:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit OTP sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-12">
              <div className="flex flex-col justify-center items-center">
                <InputOTP
                  maxLength={6}
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 6,
                      message: "Please enter all 6 digits",
                    },
                  })}
                  onChange={(value) => setValue("otp", value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {errors.otp && (
                  <span className="text-red-500 text-sm mt-2">
                    {errors.otp.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
            <div>
              <p onClick={handleResendOtp} className="text-center  text-gray-500 mt-4">
                Didn&apos;t receive the OTP?{" "}
                <span className="text-black font-normal cursor-pointer">
                  Resend OTP
                </span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
