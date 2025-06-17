import DropOff from "@/components/core/drop-off";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function Page() {
  return (
    <div className="!py-12">
      <div className="">
        <div className="grid grid-cols-3 gap-6">
          <Label className="col-span-3">Product Image:</Label>
          <DropOff type="square" />
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <div className="col-span-2 !space-y-6">
              <Label>Product Name:</Label>
              <Input />
            </div>
            <div className="!space-y-6">
              <div className="!space-y-6">
                <Label>Product Price:</Label>
                <Input />
              </div>
            </div>
            <div className="!space-y-6">
              <Label>Discount (%):</Label>
              <Input />
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-6">
            <Label>Available in stock</Label>
            <Input />
          </div>
          <div className="flex flex-col justify-start items-start gap-6">
            <Label>Brand Name</Label>
            <Input />
          </div>
          <div className="flex flex-col justify-start items-start gap-6">
            <Label>Discount until:</Label>
            <Input />
          </div>
          <div className="col-span-3 !space-y-6">
            <Label>Product Description: </Label>
            <Textarea className="h-[160px]" />
          </div>

          <div className="col-span-3 !space-y-6">
            <div className="!space-y-6">
              <Label>Question #1</Label>
              <Input />
              <Label>Answer #1</Label>
              <Input />
            </div>
            <Separator />
            <div className="!space-y-6">
              <Label>Question #2</Label>
              <Input />
              <Label>Answer #2</Label>
              <Input />
            </div>
            <Separator />
            <Button variant="outline">Add more FAQ&apos;s</Button>
          </div>
        </div>
        <div className="!py-12 flex justify-center items-center">
          <Button>Confim Update</Button>
        </div>
      </div>
    </div>
  );
}
