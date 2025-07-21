"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  useCreateGroupMutation,
  useGetGroupQuery,
} from "@/redux/features/Forum/ForumApi";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Group name is required"),
  description: z.string().min(1, "Description is required"),
  isPrivate: z.boolean().optional(), // new field, default to false (public)
});

export default function Page() {
  const [createGroup] = useCreateGroupMutation();

  const navig = useRouter();
  const id = useSearchParams().get("id");
  const { data, isLoading } = useGetGroupQuery({ id: id ?? "" });
  if (!isLoading) {
    console.log(data);
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  useEffect(() => {
    form.setValue("title", data?.data?.title);
    form.setValue("description", data?.data?.description);

    return () => {};
  }, [data, form]);
  if (!id) {
    navig.back();
    return (
      <main className=" py-6 px-4 flex justify-center items-center">
        Please Select a group first
      </main>
    );
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Forum Group Created:", data);

    try {
      const res = await createGroup(data).unwrap();
      console.log(res);

      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      toast.success("Forum group created successfully!");
      navig.push(`/forum/thread/${res.data.id}`);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong..");
    }
  };

  if (isLoading) {
    return (
      <main className="py-12 p-6 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4!">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-2!">
                <FormLabel>Group name :</FormLabel>
                <FormControl>
                  <Input placeholder="Enter group name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2!">
                <FormLabel>Group Description :</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className="h-[30dvh]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Forum Group</Button>
        </form>
      </Form>
    </main>
  );
}
