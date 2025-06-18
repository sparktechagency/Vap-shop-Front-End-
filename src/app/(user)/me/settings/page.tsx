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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Page() {
  const { setTheme } = useTheme();
  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Reviews</h1>
      <Separator />
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
        <div className="">
          <h1 className="text-center text-3xl font-semibold">
            Change Password
          </h1>
          <div className="!space-y-4">
            <Label>Current Password</Label>
            <Input /> <Label>New Password</Label>
            <Input /> <Label>Confirm Password</Label>
            <Input />
            <div className="flex justify-center !mt-10">
              <Button>Change Password</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
