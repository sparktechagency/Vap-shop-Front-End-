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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useResendotpMutation } from "@/redux/features/AuthApi";

interface ForgotFormData {
  email: string;
}

export function ForgotForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [resendOtp, { isLoading }] = useResendotpMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>();

  const onSubmit = async (data: ForgotFormData) => {
    const formdata = {
      email: data.email,
    };

    try {
      const response = await resendOtp(formdata).unwrap();
      console.log("Resend OTP response:", response);
      if (response.ok) {
        toast.success(response.message || "OTP sent successfully!");
        // Redirect to verify-otp page with email in query params
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to get an OTP to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email", {
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
            <div className="!mt-4 text-center text-sm">
              Have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
