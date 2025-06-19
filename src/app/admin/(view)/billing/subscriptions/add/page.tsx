"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  features: z
    .array(
      z.object({
        name: z.string().min(1, "Feature name is required"),
      })
    )
    .min(1, "At least one feature is required"),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "",
      features: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Transform the data to have features as an array of strings
    const submissionData = {
      ...values,
      features: values.features
        .map((feature) => feature.name)
        .filter((name) => name.trim() !== ""),
    };
    console.log(submissionData);
  }

  const addFeature = () => {
    append({ name: "" });
  };

  const removeFeature = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <main className="max-w-2xl !mx-auto p-6!">
      <h1 className="text-2xl lg:text-4xl my-6! font-semibold">
        ADD A NEW SUBSCRIPTION
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8!">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Title</FormLabel>
                <FormControl>
                  <Input placeholder="Core feature" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Price</FormLabel>
                <FormControl>
                  <Input placeholder="32" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4!">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Feature list:</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <PlusIcon className="w-4 h-4 mr-2!" />
                Add Feature
              </Button>
            </div>

            <div className="space-y-3!">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`features.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature {index + 1}</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter feature name" {...field} />
                        </FormControl>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFeature(index)}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full justify-center items-center">
            <Button type="submit" className="w-full max-w-xs">
              Create Subscription
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
