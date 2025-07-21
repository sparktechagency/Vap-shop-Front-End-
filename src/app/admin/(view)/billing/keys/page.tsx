"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Eye, EyeOff, Shield } from "lucide-react";
import {
  paymentGatewaySchema,
  type PaymentGatewayFormData,
} from "@/lib/schemas";
import {
  useGetPGKeysQuery,
  usePostPGKeysMutation,
} from "@/redux/features/keys/keysApi";
import { toast } from "sonner";

export default function PaymentGatewayForm() {
  const [showLoginId, setShowLoginId] = useState(false);
  const [showTransactionKey, setShowTransactionKey] = useState(false);
  const { data, isLoading, isError } = useGetPGKeysQuery();
  const [updateKeys] = usePostPGKeysMutation();
  const form = useForm<PaymentGatewayFormData>({
    resolver: zodResolver(paymentGatewaySchema),
    defaultValues: {
      login_id: "",
      transaction_key: "",
    },
  });

  async function onSubmit(values: PaymentGatewayFormData) {
    console.log(values);
    try {
      const res = await updateKeys(values).unwrap();
      if (!res.ok) {
        toast.error(res.message ?? "Failed to Update Gateway cradentials");
      } else {
        toast.success(
          res.message ?? "Successfully updated the gateway cradentials"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isLoading && !isError) {
      try {
        form.setValue("login_id", data.data.login_id);
        form.setValue("transaction_key", data.data.transaction_key);
      } catch (error) {
        console.error(error);
        toast.error("Failed to get login data");
      }
    }
    return () => {};
  }, [isLoading]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="rounded-full bg-secondary p-3">
              <CreditCard className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Gateway Setup
          </h1>
          <p className="text-gray-600">
            Configure your payment credentials to start accepting payments
          </p>
        </div>

        {/* Security Notice */}
        <Alert variant={"warn"}>
          <Shield />
          <AlertDescription>
            Your credentials are encrypted and stored securely. We never share
            your payment information.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Gateway Credentials</CardTitle>
            <CardDescription>
              Enter your payment gateway login credentials below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                autoComplete="off"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Login ID */}
                <FormField
                  control={form.control}
                  name="login_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showLoginId ? "text" : "password"}
                            placeholder="Enter your gateway login ID"
                            autoComplete="off"
                            aria-autocomplete="none"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowLoginId(!showLoginId)}
                          >
                            {showLoginId ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="sr-only">
                              {showLoginId ? "Hide" : "Show"} login ID
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Transaction Key */}
                <FormField
                  control={form.control}
                  name="transaction_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Key</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showTransactionKey ? "text" : "password"}
                            placeholder="Enter your transaction key"
                            autoComplete="off"
                            aria-autocomplete="none"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowTransactionKey(!showTransactionKey)
                            }
                          >
                            {showTransactionKey ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="sr-only">
                              {showTransactionKey ? "Hide" : "Show"} transaction
                              key
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Configure Payment Gateway
                </Button>

                {/* Help Text */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Need help finding your credentials?{" "}
                    <a
                      href="https://www.authorize.net/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit Authorize.net
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
