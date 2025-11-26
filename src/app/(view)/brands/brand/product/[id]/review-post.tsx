"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { StarIcon } from "lucide-react";
import { toast } from "sonner";
import { usePostReviewMutation } from "@/redux/features/others/otherApi";

// 1. Zod schema
const reviewSchema = z.object({
  review: z
    .string()
    .min(3, { message: "Review must be at least 3 characters." })
    .max(500, { message: "Review is too long." }),
  rating: z.enum(["0", "1", "2", "3", "4", "5"], {
    required_error: "Rating is required",
  }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function ReviewPost({
  productId,
  role,
}: {
  productId: string;
  role: number;
}) {
  const [reviewAdd] = usePostReviewMutation();

  // 2. Form hook
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      review: "",
      rating: "0",
    },
  });

  // 3. Submit
  const onSubmit = async (data: ReviewFormValues) => {
    try {
      const reviewAdded = await reviewAdd({
        rating: data.rating,
        comment: data.review,
        role: role,
        product_id: productId,
      }).unwrap();
      if (!reviewAdded.ok) {
        toast.error("Review Submit Failed!");
      } else {
        toast.success(`You just reviewed this product!`);
        form.reset();
      }
    } catch (error) {
      toast.error("Something went wrong..");
      console.error(error);
    }
  };

  return (
    <div className="my-12! flex flex-col gap-6 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-4 w-full"
        >
          {/* Review Text */}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Review</FormLabel>
                <FormControl>
                  <Input placeholder="Write your review..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating Select */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full overflow-hidden">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5"].map((value) => (
                        <SelectItem key={value} value={value}>
                          {value === "0" ? (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <StarIcon className="w-4 h-4" /> No rating
                            </span>
                          ) : (
                            <span className="flex items-center gap-[2px]">
                              {Array.from({ length: parseInt(value) }).map(
                                (_, idx) => (
                                  <StarIcon
                                    key={`star-${value}-${idx}`}
                                    fill="#FFD700"
                                    stroke=""
                                    className="w-4 h-4"
                                  />
                                )
                              )}
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="self-end mt-6! md:mt-0!">
            Post review
          </Button>
        </form>
      </Form>
    </div>
  );
}
