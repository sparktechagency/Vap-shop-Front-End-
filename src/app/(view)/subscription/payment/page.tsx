"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const type = useSearchParams().get("type");

  return (
    <main className="py-12 px-4 lg:px-[7%] flex justify-center items-center">
      <Card className="w-full lg:w-1/2 mx-auto">
        <CardHeader>
          <CardTitle>
            {type === "acm"
              ? "Advocacy Champion Membership"
              : "Advocacy Champion Membership + Hemp Advocacy Add-On"}
          </CardTitle>
        </CardHeader>
        <CardContent>~Payment form here~</CardContent>
        <CardFooter>
          <Button>Confirm payment</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
