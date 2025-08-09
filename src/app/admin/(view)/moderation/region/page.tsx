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

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateRegionMutation } from "@/redux/features/others/otherApi";

const regionSchema = z.object({
  country_id: z.string().min(1, "Please select a country"),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

type RegionFormData = z.infer<typeof regionSchema>;

export default function Page() {
  const { data: countries, isLoading: cLoading, refetch } = useCountysQuery();
  const [createRegion] = useCreateRegionMutation();

  const form = useForm<RegionFormData>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      country_id: "",
      name: "",
      code: "",
    },
  });

  const onSubmit = async (data: RegionFormData) => {
    try {
      const res = await createRegion(data).unwrap();
      if (!res.ok) {
        toast.error(res?.message ?? "Failed to create region");
      } else {
        toast.success(res?.message ?? "Successfully added region");
        form.reset();
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <>
      <h3 className="font-semibold text-xl p-4 pb-2! border-b">
        Manage Regions
      </h3>

      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Region</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new region</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              {/* Country */}
              <div className="space-y-4">
                <Label>Country</Label>
                <Controller
                  control={form.control}
                  name="country_id"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {!cLoading &&
                          countries?.data?.map((x: any) => (
                            <SelectItem key={x.id} value={String(x.id)}>
                              {x.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.country_id && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.country_id.message}
                  </p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-4">
                <Label>Name</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Code */}
              <div className="space-y-4 mb-6">
                <Label>Code</Label>
                <Input {...form.register("code")} />
                {form.formState.errors.code && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">
                  Add Region
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Regions countries={countries} loading={cLoading} refetch={refetch} />
    </>
  );
}
