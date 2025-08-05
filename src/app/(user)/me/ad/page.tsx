"use client";
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
import React, { useState } from "react";

export default function Page() {
  const [selectedSlot, setSelectedSlot] = useState(1);
  return (
    <section className="pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl!">
            Post An Advertisement request
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">
          {Array(6)
            .fill("")
            .map((_, i) => (
              <Card className="aspect-square!" key={i}>
                <CardHeader>
                  <CardTitle>Slot {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 w-full flex justify-center items-center">
                  <Button
                    disabled={selectedSlot === i + 1}
                    onClick={() => {
                      setSelectedSlot(i + 1);
                    }}
                    variant={selectedSlot === i + 1 ? "outline" : "default"}
                  >
                    {selectedSlot === i + 1 ? "Selected Slot" : "Select Slot"}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </CardContent>
      </Card>
      <div className="w-full mt-6">
        <h3 className="font-semibold text-sm">Description:</h3>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere sit
          ad laboriosam ullam aut quos nemo? Labore molestiae cupiditate, et
          voluptates rerum expedita similique, voluptatum in ullam quos totam
          ratione!
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Input placeholder="Price" type="number" readOnly />
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            {Array(4)
              .fill("")
              .map((_, i) => (
                <SelectItem value={String(i + 1)} key={i}>
                  {i + 1} week
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"1"}>Vape Kits</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"1"}>NY, USA</SelectItem>
          </SelectContent>
        </Select>
        <Button>Submit Ad Request</Button>
      </div>
    </section>
  );
}
