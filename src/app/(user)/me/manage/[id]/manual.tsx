/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import JoditEditor from "jodit-react";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

const formSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_price: z.string().optional(),
  product_discount: z.string().optional(),
  product_stock: z.string().optional(),
  brand_name: z.string().optional(),
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
  const { data: cats, isLoading: catLoading } = useGetallCategorysQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: false,
    }
  );
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing your product description here...",
      height: "400px",

      // ADD `as const` TO THE VALUE 👇
      enter: "p" as const,
    }),
    []
  );
  const [updateProduct] = useUpdateProductMutation();
  const [imageurl, setImageurl] = useState<string | null>(null);
  const { role } = useUser();
  const [imageChanged, setImageChanged] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: String(prod?.product_name ?? ""),
      product_price: String(prod?.product_price ?? ""),
      product_discount: String(
        prod?.product_discount === "0.00%" ? "0" : prod?.product_discount ?? "0"
      ),
      product_stock: String(prod?.product_stock ?? ""),
      brand_name: String(prod?.brand_name ?? ""),
      category_id: String(prod?.category_id ?? ""), // ✅ set from prod here
      product_description: String(prod?.product_description ?? ""),
      faqs:
        prod?.product_faqs?.map((f: any) => ({
          question: String(f.question ?? ""),
          answer: String(f.answer ?? ""),
        })) || [],
      thc_percentage: String(prod?.thc_percentage ?? ""),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  useEffect(() => {
    if (!prod || !cats?.data) return;
    setImageurl(prod?.product_image_url ?? null);
    form.reset({
      product_name: String(prod.product_name ?? ""),
      product_price: String(prod.product_price ?? ""),
      product_discount: String(
        prod.product_discount === "0.00%" ? "0" : prod.product_discount ?? "0"
      ),
      product_stock: String(prod.product_stock ?? ""),
      brand_name: String(prod.brand_name ?? ""),
      category_id: String(prod.category_id),
      product_description: String(prod.product_description ?? ""),
      thc_percentage: String(prod.thc_percentage ?? ""),
      faqs:
        prod.product_faqs?.map((f: any) => ({
          question: String(f.question ?? ""),
          answer: String(f.answer ?? ""),
        })) || [],
    });
  }, [cats?.data, form, prod]);

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
      setImageChanged(true);
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

      if (selectedFile && imageChanged) {
        formData.append("product_image", selectedFile);
      }

      Object.entries(data).forEach(([key, value]) => {
        if (key === "product_discount") return;

        if (key === "faqs") {
          data?.faqs?.forEach((faq, index) => {
            formData.append(`product_faqs[${index}][question]`, faq.question);
            formData.append(`product_faqs[${index}][answer]`, faq.answer);
          });
        } else {
          formData.append(key, value ? String(value) : "");
        }
      });

      if (data.product_discount && data.product_price) {
        const discountValue = parseFloat(data.product_discount);
        const priceValue = parseFloat(data.product_price);
        const calculatedDiscount = priceValue * (discountValue / 100);

        formData.append("product_discount", calculatedDiscount.toString());
        formData.append("product_discount_unit", data.product_discount);
      } else {
        formData.append("product_discount", "0");
        formData.append("product_discount_unit", "0");
      }

      formData.append("thc_percentage", data.thc_percentage ?? "0");

      if (prod.product_id) {
        formData.append("product_id", prod.product_id);
      }
      formData.append("_method", "PUT");
      let res;
      try {
        res = await updateProduct({
          body: formData,
          id: String(prod.id),
        }).unwrap();
      } catch (apiError: any) {
        // If unwrap throws (usually when error response), show toast and exit
        toast.error(apiError?.data?.message || "Update failed");
        console.error("API error:", apiError);
        return;
      }

      if (!res.ok) {
        toast.error(res.message ?? "Update failed");
        console.error(res);
        return;
      }

      toast.success("Product has been uploaded successfully.");
      setSelectedFile(null);
      setImageChanged(false);
    } catch (error: any) {
      // Fallback catch for unexpected errors (code bugs, form data issues, etc)
      console.error("Unexpected submission error:", error);
      toast.error(
        error?.message || "Failed to upload product. Please try again."
      );
    }
  };

  const addFAQ = () => {
    append({ question: "", answer: "" });
  };

  const removeFAQ = (index: number) => {
    remove(index);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Image Upload with Drag and Drop */}
            <div className="col-span-full space-y-2">
              <FormLabel>Product Image:</FormLabel>
              <div className="">
                {imageurl && !imageChanged && (
                  <div className="size-[300px] relative">
                    <Image
                      src={imageurl ?? ""}
                      height={800}
                      width={800}
                      className="size-[300px]"
                      alt="product_image"
                    />
                    <div className="w-full h-full hover:bg-background/30 hover:backdrop-blur-xs absolute top-0 right-0 transition-all flex justify-center items-center opacity-0 hover:opacity-100">
                      <Button
                        type="button"
                        onClick={() => {
                          setImageChanged(true);
                        }}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                )}
                {!imageurl && !imageChanged && (
                  <>
                    <Image
                      src={prod.product_image ?? ""}
                      height={800}
                      width={800}
                      className="size-[300px] rounded-lg"
                      alt="product_image"
                    />
                    <Button
                      type="button"
                      onClick={() => setImageChanged(true)}
                      variant={"outline"}
                      className="mt-6"
                    >
                      Upload Image
                    </Button>
                  </>
                )}

                {imageChanged && (
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
                    <FormLabel>Brand Name (Optional)</FormLabel>
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
                        {(!catLoading ? cats?.data : []).map((x: any) => (
                          <SelectItem value={String(x.id)} key={x.id}>
                            {x.name}
                          </SelectItem>
                        ))}
                        {field.value &&
                          !cats?.data?.some(
                            (x: any) => String(x.id) === field.value
                          ) && (
                            <SelectItem value={field.value}>
                              Current category
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Description */}
            {/* --- PRODUCT DESCRIPTION (UPDATED) --- */}
            <FormField
              control={form.control}
              name="product_description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Product Description:</FormLabel>
                  <FormControl>
                    <JoditEditor
                      ref={editor}
                      value={field.value}
                      config={config}
                      onBlur={field.onChange} // Use onBlur to update the form state
                      onChange={() => {
                        /* You can leave this empty or use for real-time logic */
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* --- END PRODUCT DESCRIPTION --- */}

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

              {fields.length === 0 && (
                <p className="text-sm text-gray-500">
                  No FAQs added (optional)
                </p>
              )}

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
