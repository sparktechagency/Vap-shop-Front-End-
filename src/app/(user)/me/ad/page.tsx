"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountysQuery } from "@/redux/features/AuthApi";

import { useTrendAdBrandMutation } from "@/redux/features/manage/product";
import { toast } from "sonner";

export default function Page() {
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [region, setRegion] = useState("");

  const [trendBrandApi] = useTrendAdBrandMutation();
  // queries
  const { data: countryData, isLoading: isRegionsLoading } = useCountysQuery();

  const handleSubmit = async () => {
    const payload = {
      amount: Number(amount),
      preferred_duration: duration,
      region_id: region,
      slot: selectedSlot,
    };
    try {
      const res: any = await trendBrandApi(payload).unwrap();

      if (!res.ok) {
        toast.error(res.message ?? "Failed to complete this request");
      } else {
        toast.success(res.message ?? "Successfully created ad request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="pt-6">
      {/* Slot selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Post An Advertisement Request
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card className="aspect-square" key={i}>
              <CardHeader>
                <CardTitle>Slot {i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 w-full flex justify-center items-center">
                <Button
                  disabled={selectedSlot === i + 1}
                  onClick={() => setSelectedSlot(i + 1)}
                  variant={selectedSlot === i + 1 ? "outline" : "default"}
                >
                  {selectedSlot === i + 1 ? "Selected Slot" : "Select Slot"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Description */}
      <div className="w-full mt-6">
        <h3 className="font-semibold text-sm">Description:</h3>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      {/* Amount + Duration */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Input
          placeholder="Price"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1_week">1 week</SelectItem>
            <SelectItem value="2_weeks">2 weeks</SelectItem>
            <SelectItem value="1_month">1 month</SelectItem>
            <SelectItem value="3_months">3 months</SelectItem>
            <SelectItem value="6_months">6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category + Region + Submit */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <Select
          value={region}
          onValueChange={setRegion}
          disabled={isRegionsLoading}
        >
          <SelectTrigger className="w-full col-span-2">
            <SelectValue
              placeholder={isRegionsLoading ? "Loading..." : "Select Region"}
            />
          </SelectTrigger>
          <SelectContent>
            {!isRegionsLoading &&
              countryData?.data?.flatMap((ctr: any) =>
                ctr.regions.map((r: any) => (
                  <SelectItem value={String(r.id)} key={r.id}>
                    {r.name} ({r.code}), {ctr.name}
                  </SelectItem>
                ))
              )}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit}>Submit Ad Request</Button>
      </div>
    </section>
  );
}
