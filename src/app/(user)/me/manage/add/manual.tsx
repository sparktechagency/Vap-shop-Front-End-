/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import DropOff from "@/components/core/drop-off";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";
import { usePostProductMutation } from "@/redux/features/manage/product";
import { useUser } from "@/context/userContext";

const formSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_price: z.string().min(1, "Product price is required"),
  product_discount: z.string().optional(),
  product_stock: z.string().min(1, "Stock quantity is required"),
  brand_name: z.string().min(1, "Brand name is required"),
  // discountUntil: z.string().optional(),
  category_id: z.string().min(1, "Please select a category"),
  product_description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .min(1, "At least one FAQ is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: cats, isLoading: catLoading } = useGetallCategorysQuery();
  const [postProduct] = usePostProductMutation();
  const { role } = useUser();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      product_price: "",
      product_discount: "",
      product_stock: "",
      brand_name: "",
      category_id: "",
      product_description: "",
      faqs: [{ question: "", answer: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add the file if selected
      if (selectedFile) {
        formData.append("product_image", selectedFile);
      }

      console.log(data.faqs);

      // Add all form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "faqs") {
          data.faqs.forEach((faq, index) => {
            formData.append(`product_faqs[${index}][question]`, faq.question);
            formData.append(`product_faqs[${index}][answer]`, faq.answer);
          });

          console.log(formData.get("product_faqs"));
        } else if (key === "product_discount") {
          formData.append("product_discount_unit", value as string);

          formData.append(
            "product_discount",
            String(
              parseFloat(data.product_price) *
              (parseFloat(data.product_discount ?? "0") / 100)
            )
          );
        } else {
          formData.append(key, value as string);
        }
      });

      // Log the data (replace with actual API call)
      console.log("Form Data:", data);
      console.log("Selected File:", selectedFile);
      console.log("<--------------------<");

      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log(">-------------------->");
      // Simulate API call
      const res = await postProduct(formData).unwrap();

      console.log(res);

      if (!res.ok) return toast.error(res.message);
      toast("Success!", {
        description: "Product has been uploaded successfully.",
      });

      // Reset form after successful submission
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error", {
        description: "Failed to upload product. Please try again.",
      });
    }
  };

  const addFAQ = () => {
    append({ question: "", answer: "" });
  };

  const removeFAQ = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="py-12! px-4! sm:px-6! lg:px-8!">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8!">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Image Upload */}
            <div className="col-span-full space-y-2!">
              <FormLabel>Product Image:</FormLabel>
              <DropOff
                type="square"
                onFileSelect={(file: File) => {
                  setSelectedFile(file);
                  console.log("File selected:", file);
                }}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2!">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Product Name */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="product_name"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Product Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Price */}
              <FormField
                control={form.control}
                name="product_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {role == "3"
                        ? "Product Price(For B2B):"
                        : "Product Price:"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount */}
              <FormField
                control={form.control}
                name="product_discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%):</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        min="0"
                        max="100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available in stock</FormLabel>
                    <FormControl>
                      <Input placeholder="0" type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Select Category:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!catLoading &&
                          cats.data.map((x: any) => (
                            <SelectItem value={String(x.id)} key={x.id}>
                              {x.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock */}

            {/* Brand Name */}

            {/* Discount Until */}
            {/* <FormField
              control={form.control}
              name="product_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount until:</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Category */}

            {/* Product Description */}
            <FormField
              control={form.control}
              name="product_description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Product Description:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="h-[160px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FAQs Section */}
            <div className="col-span-full space-y-6!">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold">FAQs</FormLabel>
                <Button type="button" variant="outline" onClick={addFAQ}>
                  Add FAQ
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4! p-4! border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">FAQ #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFAQ(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`faqs.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter question" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`faqs.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter answer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-10 flex justify-center items-center">
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Uploading..." : "Confirm Upload"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
