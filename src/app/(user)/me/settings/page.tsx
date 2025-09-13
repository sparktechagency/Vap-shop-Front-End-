/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useUpdatePassMutation } from "@/redux/features/AuthApi";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import PaymentAlert from "./payment-alert";
import { useGetPGKeysQuery } from "@/redux/features/keys/keysApi";
import { ArrowRight } from "lucide-react";

const formSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type PasswordFormType = z.infer<typeof formSchema>;

export default function Page() {
  const [updatePassword] = useUpdatePassMutation();
  const { isError } = useGetPGKeysQuery();
  const form = useForm<PasswordFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });
  const onSubmit = async (data: PasswordFormType) => {
    try {
      const res: any = await updatePassword(data);
      console.log(res);

      if (res.data.ok) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error.data.message);
      }
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const { setTheme } = useTheme();
  const my = useUser();
  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Settings</h1>
      <Separator />
      <div className="mt-12">
        <Card>
          <CardContent className="flex justify-between items-center">
            <CardTitle>
              Current Subscription:{" "}
              <Badge variant="outline">
                FREE {my.role_label?.toUpperCase()}
              </Badge>
            </CardTitle>
            <Button asChild>
              <Link href="/subscription">Manage Subscription</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      {String(my.role) !== String(6) &&
        String(my.role) !== String(2) &&
        (!isError ? (
          <div>
          <div className="mt-12">
            <Card>
              <CardContent className="flex justify-between items-center">
                <CardTitle>Manage Payment gateway cradentials</CardTitle>
                <Button asChild>
                  <Link href="/me/settings/payment">
                    Manage Payment cradentials <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12">
            <Card>
              <CardContent className="flex justify-between items-center">
                <CardTitle> additional Option below (Gateway Setup)</CardTitle>
                <Button asChild>
                  <Link target="_blank" href="https://pages.ecrypt.com/vape-shop-maps">
                 Setup <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>
        ) : (
          <PaymentAlert />
        ))}
      <div className="!my-12 !space-y-6">
        <div className="">
          <h1 className="text-center text-3xl font-semibold">Appearance</h1>
          <div className="grid grid-cols-3 !my-12">
            <div className=""></div>
            <Select onValueChange={(value) => setTheme(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <div className=""></div>
          </div>
        </div>
        <div className="mt-12!">
          <h1 className="text-center text-3xl font-semibold">
            Change Password
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4! max-w-md mx-auto! mt-12!"
            >
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center !mt-10">
                <Button type="submit">Change Password</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
