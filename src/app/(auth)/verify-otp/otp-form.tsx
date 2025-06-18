'use client';
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
import { useVerifyemailMutation } from "@/redux/features/AuthApi";
import { useRouter, useSearchParams } from "next/navigation";

interface OTPFormData {
  otp: string;
}

export function OTPForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const isFromRegistration = searchParams?.get('isregistared') === 'true';
  const [verifyEmail, { isLoading }] = useVerifyemailMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPFormData>();

  const onSubmit = async (data: OTPFormData) => {
    try {
      const response = await verifyEmail({ otp: data.otp }).unwrap();

      if (response.ok) {
        // Store the token securely
        Cookies.set('token', response.data.access_token);

        toast.success(response.message || "Verification successful");

        // Determine redirect based on registration status
        if (isFromRegistration) {
          // For registration flow - go to homepage
          router.push('/');
        } else {
          // For password reset flow - go to reset password
          router.push('/reset-password');
        }

        // Refresh to ensure proper state update
        router.refresh();
      } else {
        toast.error(response.message || "Verification failed");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Verification failed. Please try again.");
      console.error("Verification error:", error);
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
                      message: "Please enter all 6 digits"
                    }
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
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}