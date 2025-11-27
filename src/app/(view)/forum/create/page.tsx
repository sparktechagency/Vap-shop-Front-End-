"use client";

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
import { useCreateGroupMutation } from "@/redux/features/Forum/ForumApi";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Group name is required"),
  description: z.string().min(1, "Description is required"),
  isPrivate: z.boolean().optional(), // new field, default to false (public)
});
export default function Page() {
  const [createGroup] = useCreateGroupMutation();
  const navig = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const allData = {
      ...data,
      type: "public",
    };

    try {
      const res = await createGroup(allData).unwrap();

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

  return (
    <main className="!py-12 !px-2 md:!px-[7%]">
      <h1 className="text-center font-semibold text-xl md:text-2xl lg:text-4xl mb-12!">
        CREATE A FORUM GROUP
      </h1>

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
