/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Star, TrendingUp, Clock, DollarSign, Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductDetailsByIdRoleQuery } from "@/redux/features/Trending/TrendingApi";
import { useUser } from "@/context/userContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { usePostAdMutation } from "@/redux/features/ad/adApi";

// Zod Schema
const adRequestSchema = z.object({
  duration: z.string().min(1, "Duration is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
});

type AdRequestForm = z.infer<typeof adRequestSchema>;

export default function Page() {
  const id = useSearchParams().get("id");
  const navig = useRouter();
  const { role } = useUser();
  const { data, isLoading, isError, error }: any =
    useProductDetailsByIdRoleQuery({ id: String(id), role }, { skip: !id });
  const [postAd] = usePostAdMutation();
  const [selectedDuration, setSelectedDuration] = useState<
    string | undefined
  >();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdRequestForm>({
    resolver: zodResolver(adRequestSchema),
    defaultValues: {
      duration: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (formData: AdRequestForm) => {
    const finalizer = {
      product_id: id,
      preferred_duration: formData.duration,
    };
    try {
      const call = await postAd(finalizer).unwrap();

      if (!call.ok) {
        toast.error(call.message ?? "Failed to send ad request");
      } else {
        toast.success(call.message ?? "Ad request sent to Admin");
        navig.back();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (!id) {
    navig.back();
    return <></>;
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
        {error.data.message ?? "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-6!">
      {/* Header Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-9 !py-12 bg-secondary dark:bg-zinc-900 px-4! gap-8">
        <div className="col-span-1 lg:col-span-3 border p-4 rounded-lg bg-background">
          <Image
            src={data?.data?.product_image || "/image/shop/item.jpg"}
            width={400}
            height={400}
            alt="Product Preview"
            className="aspect-square object-cover object-center w-full rounded-md shadow-lg"
          />
          <div className="w-full mt-2">
            <p className="text-xl font-bold">{data?.data?.product_name}</p>
            <p className="text-sm space-x-2">
              <span className="font-bold">Brand:</span>
              <span>{data?.data?.brand_name}</span>
            </p>
          </div>
          <div className="!mt-4 !space-y-2">
            <Badge variant="secondary" className="w-full justify-center !py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending Ad Request
            </Badge>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-6">
          <h1 className="text-4xl lg:text-6xl font-semibold !mb-6">
            Request Trending Ad Placement
          </h1>
          <p className="text-muted-foreground !mb-8 text-lg">
            Submit your product for consideration in our trending ads section.
            Get maximum visibility and boost your sales with premium placement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 !mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 !mx-auto !mb-2 text-yellow-500" />
                <h3 className="font-semibold">Premium Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Top section placement
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 !mx-auto !mb-2 text-green-500" />
                <h3 className="font-semibold">Increased Attention</h3>
                <p className="text-sm text-muted-foreground">
                  Up to 300% more views
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4! text-center">
                <Clock className="w-8 h-8 !mx-auto !mb-2 text-blue-500" />
                <h3 className="font-semibold">Quick Approval</h3>
                <p className="text-sm text-muted-foreground">
                  24-48 hour review
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-2/3 mx-auto! px-4! lg:px-[7%]! py-12!"
      >
        <div className="">
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Advertisement Preferences
              </CardTitle>
              <CardDescription>
                Specify your advertising requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4!">
                <Label htmlFor="ad-duration">Preferred Duration *</Label>
                <Select
                  onValueChange={(val) => {
                    setSelectedDuration(val);
                    setValue("duration", val);
                  }}
                  value={selectedDuration}
                >
                  <SelectTrigger className="mt-1! w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_week">1 Week</SelectItem>
                    <SelectItem value="2_weeks">2 Weeks</SelectItem>
                    <SelectItem value="1_month">1 Month</SelectItem>
                    <SelectItem value="3_months">3 Months</SelectItem>
                    <SelectItem value="6_months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="text-sm text-red-500">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8!">
            <CardContent className="pt-6!">
              <div className="space-y-4!">
                <div className="flex items-start space-x-2!">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("termsAccepted")}
                    className="mt-1!"
                  />
                  <Label
                    htmlFor="terms"
                    className="inline-block text-sm leading-relaxed"
                  >
                    I agree to the{" "}
                    <span className="text-primary underline cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and
                    <span className="text-primary underline cursor-pointer">
                      {" "}
                      Privacy Policy
                    </span>
                    . I understand that ad placement is subject to approval and
                    availability.
                  </Label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-500">
                    {errors.termsAccepted.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8!">
                <Button type="submit" className="flex-1">
                  Submit Ad Request
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4! text-center">
                Admin will review your request within 24-48 hours and contact
                you with next steps.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
