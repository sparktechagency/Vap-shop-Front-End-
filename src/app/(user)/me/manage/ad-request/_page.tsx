/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductDetailsByIdRoleQuery } from "@/redux/features/Trending/TrendingApi";
import { usePostAdMutation } from "@/redux/features/ad/adApi";
import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";
import { useUser } from "@/context/userContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2Icon, Star, TrendingUp, Clock, DollarSign } from "lucide-react";

const formSchema = z.object({
  preferred_duration: z.string().min(1, "Duration is required"),
  slot: z.string().min(1, "Slot selection is required"),
  category_id: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
});

export default function Page() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const { role } = useUser();
  const { data, isLoading, isError, error }: any =
    useProductDetailsByIdRoleQuery({ id: String(id), role }, { skip: !id });
  const { data: cats, isLoading: catLoading } = useGetallCategorysQuery();
  const [postAd] = usePostAdMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferred_duration: "",
      slot: "",
      category_id: "",
      amount: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      product_id: id,
      preferred_duration: values.preferred_duration,
      slot: values.slot,
      category_id: values.category_id,
      amount: values.amount,
    };

    try {
      const res = await postAd(payload).unwrap();
      if (res.ok) {
        toast.success(res?.message || "Ad request sent to Admin");
        router.back();
      } else {
        toast.error(res?.message || "Failed to send ad request");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (!id) {
    router.back();
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        {error?.data?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-6">
      <h2 className="text-2xl font-bold mb-4 px-4">Product Preview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-9 py-12 bg-secondary dark:bg-zinc-900 px-4 gap-8">
        <div className="col-span-1 lg:col-span-3 border p-4 rounded-lg bg-background">
          <Image
            src={data?.product_image || "/image/shop/item.jpg"}
            width={400}
            height={400}
            alt="Product Preview"
            className="aspect-square object-cover object-center w-full rounded-md shadow-lg"
          />
          <div className="mt-2">
            <p className="text-xl font-bold">{data?.data?.product_name}</p>
            <p className="text-sm">
              <span className="font-bold">Brand:</span> {data?.data?.brand_name}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <Badge variant="secondary" className="w-full justify-center py-2">
              <TrendingUp className="w-4 h-4 mr-2" /> Trending Ad Request
            </Badge>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-6">
          <h1 className="text-4xl lg:text-6xl font-semibold mb-6">
            Request Trending Ad Placement
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Submit your product for consideration in our trending ads section.
            Get maximum visibility and boost your sales with premium placement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="font-semibold">Premium Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Top section placement
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold">Increased Attention</h3>
                <p className="text-sm text-muted-foreground">
                  Up to 300% more views
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold">Quick Approval</h3>
                <p className="text-sm text-muted-foreground">
                  24-48 hour review
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 px-4">
        Advertisement Preferences
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full lg:w-2/3 mx-auto px-4 lg:px-[7%] py-12"
        >
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Advertisement Preferences
              </CardTitle>
              <CardDescription>
                Specify your advertising requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="preferred_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Duration *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1_week">1 Week</SelectItem>
                        <SelectItem value="2_weeks">2 Weeks</SelectItem>
                        <SelectItem value="1_month">1 Month</SelectItem>
                        <SelectItem value="3_months">3 Months</SelectItem>
                        <SelectItem value="6_months">6 Months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Slot *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st_slot">1st Slot</SelectItem>
                        <SelectItem value="2nd_slot">2nd Slot</SelectItem>
                        <SelectItem value="3rd_slot">3rd Slot</SelectItem>
                        <SelectItem value="4th_slot">4th Slot</SelectItem>
                        <SelectItem value="5th_slot">5th Slot</SelectItem>
                        <SelectItem value="6th_slot">6th Slot</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {catLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : (
                          cats?.data?.map((x: { id: number; name: string }) => (
                            <SelectItem value={String(x.id)} key={x.id}>
                              {x.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mt-12 mb-4 px-4">Confirmation</h2>
          <Card className="mt-8">
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="text-sm">
                      I agree to the{" "}
                      <span className="text-primary underline cursor-pointer">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-primary underline cursor-pointer">
                        Privacy Policy
                      </span>
                      . I understand that ad placement is subject to approval
                      and availability.
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button type="submit" className="flex-1">
                  Submit Ad Request
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Admin will review your request within 24-48 hours and contact
                you with next steps.
              </p>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
