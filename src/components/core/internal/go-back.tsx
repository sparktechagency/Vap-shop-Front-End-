"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function GoBack() {
  const navig = useRouter();
  return (
    <Button
      className="flex font-semibold"
      variant="link"
      onClick={() => {
        navig.back();
      }}
    >
      <ChevronLeftIcon /> Go back
    </Button>
  );
}
