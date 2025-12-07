"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUpdateBusinessOrderMutation } from "@/redux/features/store/StoreApi";
import { CheckIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ReplaceInvoice({ data }: { data: any }) {
  const [items, setItems] = useState(
    data.order_items?.map((y: any) => ({
      product_id: y.product_id,
      quantity: y.quantity,
    })) || []
  );
  const [updateInvoice, { isLoading }] = useUpdateBusinessOrderMutation();
  const updateQty = (id: number, qty: string) => {
    setItems((prev: any) =>
      prev.map((item: any) =>
        item.product_id === id ? { ...item, quantity: Number(qty) } : item
      )
    );
  };

  const handleUpdate = async () => {
    const payload = {
      cart_items: items.map((i: any) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      })),
    };
    try {
      const res = await updateInvoice({
        id: data.order_id,
        body: payload,
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <DialogContent className="min-w-[96dvw] xl:min-w-[60dvw]">
      <DialogHeader className="border-b pb-2">
        <DialogTitle>Update order </DialogTitle>
      </DialogHeader>
      {data.order_items?.map((y: any) => (
        <div key={y.product_id} className="flex gap-4">
          <Image
            height={124}
            width={124}
            className="size-[64px] object-cover rounded-lg"
            alt="product-image"
            src={y.product_image}
          />

          <div className="grid grid-cols-2 gap-4 flex-1">
            <h4>{y.product_name}</h4>

            <div className="flex justify-end items-center w-full gap-2 text-sm">
              <Label>Quantity:</Label>
              <Input
                className="w-fit"
                defaultValue={String(y.quantity)}
                onChange={(e) => updateQty(y.product_id, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Separator />

      <DialogFooter className="flex">
        <Button onClick={handleUpdate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin" /> Updating Invoice
            </>
          ) : (
            <>
              <CheckIcon /> Update Invoice
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
