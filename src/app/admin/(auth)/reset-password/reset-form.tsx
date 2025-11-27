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
import { useAdminResetPasswrodMutation } from "@/redux/features/admin/AdminApis";
import { useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

export function ResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [adminResetPasswrod, { isLoading }] = useAdminResetPasswrodMutation();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      // Call the mutation with the FormData object
      const response = await adminResetPasswrod({
        password,
        password_confirmation: confirmPassword,
      }).unwrap();

      if (!response.ok) {
        setError(response.message || "Failed to reset password.");
        return;
      }

      if (response.ok) {
        toast.success(response.message || "Password reset successfully");
        //reset form
        setPassword("");
        setConfirmPassword("");
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      // Handle error from the API
      const errorMessage = err?.data?.message || "Failed to reset password.";
      setError(errorMessage);
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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
