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

export default function AssosRegister({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="flex w-full items-center justify-center !p-6 md:!p-10">
      <div className="w-full max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Register - Association
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Your Name</Label>
                    <Input id="email" type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Address</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className=" grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Email</Label>
                    </div>
                    <Input id="dob" type="email" required />
                  </div>
                  <div className=" grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Phone number</Label>
                    </div>
                    <Input id="dob" type="tel" required />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="dob" type="password" required />
                  </div>
                  <div className=" grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Confirm Password</Label>
                    </div>
                    <Input id="dob" type="password" required />
                  </div>
                  <div className=""></div>
                  <div className="flex flex-row justify-end items-center gap-2">
                    <Checkbox />{" "}
                    <Label>
                      Accept{" "}
                      <Link href="tnc" className="underline">
                        terms and conditions
                      </Link>
                    </Label>
                  </div>
                  <div className="col-span-2 flex flex-row justify-center items-center">
                    <Button type="submit" className="w-full">
                      Create an account
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
