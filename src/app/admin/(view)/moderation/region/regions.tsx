"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // assuming you have these
import {
  useDeleteRegionMutation,
  useEditRegionMutation,
} from "@/redux/features/others/otherApi";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

interface RegionsProps {
  countries: any;
  loading: boolean;
  refetch: () => void;
}

const regionSchema = z.object({
  country_id: z.string().min(1, "Please select a country"),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

type RegionFormData = z.infer<typeof regionSchema>;

export default function Regions({ countries, loading, refetch }: RegionsProps) {
  const [editRegion] = useEditRegionMutation();
  const [deleteRegion] = useDeleteRegionMutation();
  const [selectedRegion, setSelectedRegion] = React.useState<null | any>(null);

  const form = useForm<RegionFormData>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      country_id: "",
      name: "",
      code: "",
    },
  });

  const onSubmit = async (data: RegionFormData) => {
    if (!selectedRegion) return;

    try {
      const res = await editRegion({
        id: selectedRegion.id,
        data: { ...data, _method: "PUT" },
      }).unwrap();

      if (!res.ok) {
        toast.error(res?.message ?? "Failed to update region");
      } else {
        toast.success(
          res?.message ?? `Successfully updated region: ${data.name}`
        );
        form.reset();
        refetch();
        setSelectedRegion(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
    window.location.reload();
  };

  const handleDelete = async (id: string | number) => {
    try {
      const res = await deleteRegion({ id }).unwrap();
      if (!res.ok) {
        toast.error(res?.message ?? "Failed to delete region");
      } else {
        toast.success(res?.message ?? "Region deleted successfully");
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to delete region");
    }
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Tabs
      defaultValue={countries?.data?.[0]?.id?.toString() ?? ""}
      className="w-full"
    >
      <TabsList className="mb-4">
        {countries?.data?.map((country: any) => (
          <TabsTrigger key={country.id} value={country.id.toString()}>
            {country.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {countries?.data?.map((country: any) => (
        <TabsContent key={country.id} value={country.id.toString()}>
          {country.regions.length === 0 ? (
            <p>No regions for this country.</p>
          ) : (
            <div className="space-y-3">
              {country.regions.map((region: any) => (
                <div
                  key={region.id}
                  className="flex justify-between items-center p-3 border rounded-md shadow-sm"
                >
                  <div className="text-sm font-semibold">
                    {region.name} ({region.code})
                  </div>

                  <div className="flex space-x-2 items-center">
                    {/* Edit Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedRegion(region);
                            form.reset({
                              country_id: String(country.id),
                              name: region.name,
                              code: region.code,
                            });
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Region</DialogTitle>
                        </DialogHeader>

                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4 w-full"
                        >
                          <div className="space-y-1">
                            <Label>Country</Label>
                            <Controller
                              control={form.control}
                              name="country_id"
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {countries.data.map((c: any) => (
                                      <SelectItem
                                        key={c.id}
                                        value={String(c.id)}
                                      >
                                        {c.name}
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

                          <div className="space-y-1">
                            <Label>Name</Label>
                            <Input {...form.register("name")} />
                            {form.formState.errors.name && (
                              <p className="text-red-500 text-sm">
                                {form.formState.errors.name.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
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
                              Update Region
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    {/* Delete PopConfirm */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="outline">
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-4">
                        <div className="text-sm mb-4">
                          Are you sure you want to delete <b>{region.name}</b>?
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(region.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
