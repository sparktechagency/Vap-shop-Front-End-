/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
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
import { useUpdateProductMutation } from "@/redux/features/manage/product";
import { useUser } from "@/context/userContext";
import Image from "next/image";
const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

const formSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_price: z.string().optional(),
  product_discount: z.string().optional(),
  product_stock: z.string().optional(),
  brand_name: z.string().min(1, "Brand name is required"),
  category_id: z.string().min(1, "Please select a category"),
  product_description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  faqs: z.array(faqSchema).optional(),
  thc_percentage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm({ prod }: { prod: any }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { data: cats, isLoading: catLoading } = useGetallCategorysQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [imageurl, setImageurl] = useState<string | null>(null);
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
      faqs: [],
      thc_percentage: "",
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "faqs",
  });
  useEffect(() => {
    if (!prod) return;

    form.setValue("product_name", String(prod.product_name || ""));
    form.setValue("product_price", String(prod.product_price || ""));
    form.setValue("product_discount", String(prod.product_discount || ""));
    form.setValue("product_stock", String(prod.product_stock || ""));
    form.setValue(
      "product_description",
      String(prod.product_description || "")
    );
    form.setValue("brand_name", String(prod.brand_name || ""));
    form.setValue("category_id", String(prod.category_id || ""));
    form.setValue("thc_percentage", String(prod.thc_percentage || ""));
    console.log(prod.product_faqs);

    replace(
      prod.product_faqs?.length > 0
        ? prod.product_faqs.map((f: any) => ({
            question: String(f.question || ""),
            answer: String(f.answer || ""),
          }))
        : []
    );
  }, [prod]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setImageurl(URL.createObjectURL(file));
      }
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => {
      setIsDragging(false);
      toast.error("Please upload a valid image file (JPEG, JPG, PNG, WEBP)");
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      // 1. Append the image if selected
      if (selectedFile) {
        formData.append("product_image", selectedFile);
      }

      // 2. Append all other form data fields, excluding the discount for now
      Object.entries(data).forEach(([key, value]) => {
        if (key === "product_discount") {
          return; // Skip discount, handle it separately
        }

        if (key === "faqs") {
          data?.faqs?.forEach((faq, index) => {
            formData.append(`product_faqs[${index}][question]`, faq.question);
            formData.append(`product_faqs[${index}][answer]`, faq.answer);
          });
        } else {
          // Append other fields, ensuring null/undefined becomes an empty string
          formData.append(key, value ? String(value) : "");
        }
      });

      // 3. Always append discount fields with appropriate values
      if (data.product_discount && data.product_price) {
        const discountValue = parseFloat(data.product_discount);
        const priceValue = parseFloat(data.product_price);
        const calculatedDiscount = priceValue * (discountValue / 100);

        formData.append("product_discount", calculatedDiscount.toString());
        formData.append("product_discount_unit", data.product_discount);
      } else {
        // **THE FIX**: If no discount is entered, send "0" for both fields
        formData.append("product_discount", "0");
        formData.append("product_discount_unit", "0");
      }
      formData.append("product_id", prod.id);
      formData.append("_method", "PUT");
      // 4. Send the request
      // alert(prod.id)
      const res = await updateProduct({
        body: formData,
        id: String(prod.id),
      }).unwrap();

      if (!res.ok) {
        toast.error(res.message);
        console.log(res);

        return;
      }

      toast.success("Product has been uploaded successfully.");
      form.reset();
      setSelectedFile(null);
      setImageurl(null);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(
        error?.data?.errors || "Failed to upload product. Please try again."
      );
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
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Image Upload with Drag and Drop */}
            <div className="col-span-full space-y-2">
              <FormLabel>Product Image:</FormLabel>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 h-[200px] flex items-center justify-center text-center cursor-pointer transition-colors overflow-hidden ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                {imageurl ? (
                  <div className="flex flex-col items-center">
                    <Image
                      src={imageurl}
                      width={200}
                      height={200}
                      alt="Product preview"
                      className="mb-4 rounded-md object-cover"
                    />
                    <p className="text-sm text-gray-600">
                      Click or drag to replace the image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPEG, JPG, PNG, WEBP
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
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

              {/* Product Price (Optional) */}
              <FormField
                control={form.control}
                name="product_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {role === "3"
                        ? "Product Price (For B2B, optional):"
                        : "Product Price (optional):"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount (Optional) */}
              <FormField
                control={form.control}
                name="product_discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount % (optional):</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock (Optional) */}
              <FormField
                control={form.control}
                name="product_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available in stock (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        min="0"
                        {...field}
                        value={field.value || ""}
                      />
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
                  <FormItem>
                    <FormLabel>Select Category:</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!catLoading &&
                          cats?.data?.map((x: { id: number; name: string }) => (
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
            <FormField
              control={form.control}
              name="thc_percentage"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>THC Percentage (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Ammount "
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FAQs Section */}
            <div className="col-span-full space-y-6">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold">
                  FAQs (Optional)
                </FormLabel>
                <Button type="button" variant="outline" onClick={addFAQ}>
                  Add FAQ
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">FAQ #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFAQ(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`faqs.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter question (optional)"
                            {...field}
                          />
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
                          <Textarea
                            placeholder="Enter answer (optional)"
                            {...field}
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {fields.length === 0 && (
                <p className="text-sm text-gray-500">
                  No FAQs added (optional)
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-10 flex justify-center items-center">
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Uploading..." : "Confirm Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
