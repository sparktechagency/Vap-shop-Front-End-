/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import Regions from "./regions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountysQuery } from "@/redux/features/AuthApi";

export default function Page() {
  const { data: countries, isLoading: cLoading } = useCountysQuery();

  return (
    <>
      <h3 className="font-semibold text-xl p-4 pb-2! border-b">
        Manage Regions
      </h3>
      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="">Add New Region</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new region</DialogTitle>
            </DialogHeader>
            <div className="w-full space-y-4">
              <Label>Country</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {!cLoading &&
                    countries.data.map((x: any) => (
                      <SelectItem key={x.id} value={x.id}>
                        {x.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Label>Name:</Label>
              <Input className="" placeholder="" />
              <Label>Code:</Label>
              <Input className="" placeholder="" />
            </div>
            <DialogFooter>
              <Button className="w-full">Add Region</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Regions />
    </>
  );
}
