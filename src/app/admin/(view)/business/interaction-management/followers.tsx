"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import extractIdFromUrl from "@/lib/functions";
import { toast } from "sonner";

type FollowersFormValues = {
  profileUrl: string;
  followerCount: number;
};

export default function Followers() {
  const form = useForm<FollowersFormValues>({
    defaultValues: {
      profileUrl: "",
      followerCount: 0,
    },
  });

  const onSubmit = (values: FollowersFormValues) => {
    console.log("Form Submitted:", values);
    const id = extractIdFromUrl(values.profileUrl);
    if (id === null) {
      toast.error("Please input a valid url");
    }
    console.log("Extracted id: ", id);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Manage Followers
      </h2>
      <p className="text-gray-600 mb-6">
        Easily update follower counts for shops, brands, or wholesalers.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="profileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="Paste profile link here"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="followerCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follower Count</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Set total followers"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">Confirm</Button>
        </form>
      </Form>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Steps:</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
          <li>Copy the profile URL.</li>
          <li>Paste it into the input above.</li>
          <li>Set the total follower count.</li>
          <li>Click Confirm to update.</li>
        </ol>
      </div>
    </>
  );
}
