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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateNewpasswordMutation } from "@/redux/features/AuthApi";

interface ResetFormData {
  password: string;
  password_confirmation: string;
}

export function ResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [createNewPassword, { isLoading }] = useCreateNewpasswordMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetFormData>();

  const onSubmit = async (data: ResetFormData) => {
    try {
      const response = await createNewPassword({
        password: data.password,
        password_confirmation: data.password_confirmation,
      }).unwrap();
      console.log("Password reset response:", response);
      if (response.ok) {
        toast.success(response.message || "Password reset successfully");
        router.push("/login"); // Redirect to login after successful password reset
      } else {
        toast.error(response.message || "Password reset failed");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to reset password");
      console.error("Password reset error:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Choose a strong password this time</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">New Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password", {
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
                <div className="flex items-center">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                </div>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  {...register("password_confirmation", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords don't match",
                  })}
                />
                {errors.password_confirmation && (
                  <span className="text-red-500 text-sm">
                    {errors.password_confirmation.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Save Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
