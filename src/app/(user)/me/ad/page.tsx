"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFollowerAdMutation } from "@/redux/features/ad/adApi";

const formSchema = z.object({
  preferred_duration: z.enum(["1_week", "2_weeks", "1_month", "3_months"], {
    required_error: "Please select a preferred duration.",
  }),
});

export default function AdRequestPage() {
  const [postAd] = useFollowerAdMutation();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferred_duration: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const call = await postAd(values).unwrap();
      if (!call.ok) {
        toast.error(call.message ?? "Ad request failed to submit.");
      } else {
        toast.success(call.message ?? "Ad Request Submitted!");
        setSubmitted(true); // Lock form after success
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <main className="flex mt-[100px] items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl border border-border shadow-lg rounded-xl relative">
        {submitted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md rounded-xl">
            <p className="text-2xl font-semibold text-foreground mb-4">
              🎉 Ad Request Submitted!
            </p>
            <p className="text-muted-foreground text-center">
              You&apos;ve already submitted your request.
              <br /> Please wait for approval.
            </p>
          </div>
        )}

        <CardHeader className="space-y-2 p-6">
          <CardTitle className="text-3xl font-bold text-foreground">
            Submit Your Ad Request
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Fill out the form below to send your ad request to the admin. Your
            profile could appear on the trending section!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferred_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Preferred Duration
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={submitted}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-card text-foreground border-border focus:ring-primary">
                          <SelectValue placeholder="Select a duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card text-foreground border-border">
                        <SelectItem value="1_week">1 Week</SelectItem>
                        <SelectItem value="2_weeks">2 Weeks</SelectItem>
                        <SelectItem value="1_month">1 Month</SelectItem>
                        <SelectItem value="3_months">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-muted-foreground">
                      Choose how long you&apos;d like your ad to be featured.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold rounded-lg"
                disabled={submitted}
              >
                Submit Ad Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
