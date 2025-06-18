import React from "react";
import DropOff from "@/components/core/drop-off";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function Manual() {
  return (
    <div className="py-12! px-4 sm:px-6! lg:px-8!">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Label className="col-span-full">Product Image:</Label>
        <DropOff type="square" />
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-full space-y-2">
            <Label>Product Name:</Label>
            <Input />
          </div>
          <div className="space-y-2!">
            <Label>Product Price:</Label>
            <Input />
          </div>
          <div className="space-y-2!">
            <Label>Discount (%):</Label>
            <Input />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Available in stock</Label>
          <Input />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Brand Name</Label>
          <Input />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Discount until:</Label>
          <Input />
        </div>

        <div className="lg:col-start-3 flex flex-col gap-2">
          <Label>Select Category:</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disposables">Disposables</SelectItem>
              <SelectItem value="ejuice">E-juice</SelectItem>
              <SelectItem value="pods">PODS</SelectItem>
              <SelectItem value="mods">MODS</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-full space-y-2!">
          <Label>Product Description: </Label>
          <Textarea className="h-[160px]" />
        </div>

        <div className="col-span-full space-y-6!">
          <div className="!space-y-2">
            <Label>Question #1</Label>
            <Input />
            <Label>Answer #1</Label>
            <Input />
          </div>
          <Separator />
          <div className="space-y-2!">
            <Label>Question #2</Label>
            <Input />
            <Label>Answer #2</Label>
            <Input />
          </div>
          <Separator />
          <Button variant="outline">Add more FAQ&apos;s</Button>
        </div>
      </div>

      <div className="pt-10! flex justify-center items-center">
        <Button>Confirm Upload</Button>
      </div>
    </div>
  );
}
