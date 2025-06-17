"use client";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";

export default function BuyMachine() {
  const [amm, setAmm] = useState<number>(0);
  return (
    <div className="flex flex-col justify-start items-end gap-4 !mt-4">
      <div className="text-2xl">Amount: {amm}</div>
      <div className="flex flex-row justify-between items-center gap-4">
        <Button
          onClick={() => {
            if (amm >= 0) {
              setAmm(amm + 1);
            }
          }}
        >
          <PlusIcon />
        </Button>{" "}
        <Button>Add to cart</Button>{" "}
        <Button
          onClick={() => {
            if (amm > 0) {
              setAmm(amm - 1);
            }
          }}
        >
          <MinusIcon />
        </Button>
      </div>
    </div>
  );
}
