"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type UpvoteFormValues = {
  postId: string;
  upvoteCount: number;
};

export default function Upvote() {
  const form = useForm<UpvoteFormValues>({
    defaultValues: {
      postId: "",
      upvoteCount: 0,
    },
  });

  const onSubmit = (values: UpvoteFormValues) => {
    console.log("Form Submitted:", values);
    // send data to API here
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Upvotes</h2>
      <p className="text-gray-600 mb-6">Easily update upvotes of posts</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="postId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Paste post id here" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="upvoteCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upvote Count</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Set total upvotes"
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
          <li>As admin, go to the post</li>
          <li>Click the copy icon</li>
          <li>Paste it into the input above</li>
          <li>Set the total upvote count</li>
          <li>Click Confirm to update</li>
        </ol>
      </div>
    </>
  );
}
