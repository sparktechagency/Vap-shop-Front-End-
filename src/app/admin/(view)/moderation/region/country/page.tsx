"use client";
import React, { useEffect, useState } from "react";
import {
  useCreateCountyMutation,
  useDeleteCountryMutation,
  useGetAllAdminRegionsQuery,
  useUpdateCountyMutation,
} from "@/redux/features/AuthApi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2Icon, PenIcon, Trash2Icon } from "lucide-react";
import GoBack from "@/components/core/internal/go-back";

/** Small row component so each row keeps its own edit state */
function CountryRow({
  country,
  updateCountry,
  deleteCountry,
  refetch,
}: {
  country: any;
  updateCountry: any;
  deleteCountry: any;
  refetch?: () => void;
}) {
  const [editName, setEditName] = useState(country.name);

  // keep editName in sync if the parent updates the country prop
  useEffect(() => {
    setEditName(country.name);
  }, [country.name]);

  return (
    <TableRow key={country.id}>
      <TableCell>{country.id}</TableCell>
      <TableCell>{country.name}</TableCell>
      <TableCell>{country.regions?.length ?? 0}</TableCell>
      <TableCell className="space-x-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <PenIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update this Country</DialogTitle>
            </DialogHeader>
            <div className="">
              <Input
                placeholder="Country name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  try {
                    const res: any = await updateCountry({
                      id: country.id,
                      name: editName,
                    });
                    if (!res.ok) {
                      toast.error(res.message ?? "Something went wrong");
                    } else {
                      toast.success(res.message ?? "Successfully updated");
                      refetch?.();
                    }
                  } catch (error) {
                    console.error(error);
                    toast.error("Something went wrong");
                  }
                }}
              >
                Update Country
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          size={"icon"}
          variant={"ghost"}
          className="text-destructive"
          onClick={async () => {
            try {
              const res: any = await deleteCountry({ id: country.id });
              if (!res.ok) {
                toast.error(res.message ?? "Failed to complete this request");
              } else {
                toast.success(
                  res.message ?? "Successfully deleted this country"
                );
                refetch?.();
              }
            } catch (error) {
              console.error(error);
              toast.error("Something went wrong");
            }
          }}
        >
          <Trash2Icon />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Page() {
  const {
    data: countries,
    isLoading: cLoading,
    refetch,
  } = useGetAllAdminRegionsQuery();
  const [createCountry] = useCreateCountyMutation();
  const [deleteCountry] = useDeleteCountryMutation();
  const [updateCountry] = useUpdateCountyMutation();
  const [name, setName] = useState("");

  return (
    <div className="flex-1 w-full h-full">
      <div className="w-full flex justify-between items-center pb-6">
        <div className="">
          <GoBack />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Country</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new Country</DialogTitle>
            </DialogHeader>
            <div className="">
              <Input
                placeholder="Country name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  try {
                    const res: any = await createCountry({ name });
                    if (!res.ok) {
                      toast.error(res.message ?? "Something went wrong");
                    } else {
                      toast.success(res.message ?? "Successfully created");
                      refetch?.();
                      setName(""); // clear create input after success
                    }
                  } catch (error) {
                    console.error(error);
                    toast.error("Something went wrong");
                  }
                }}
              >
                Create Country
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country ID</TableHead>
            <TableHead>Country Name</TableHead>
            <TableHead>Region Count</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cLoading ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className={`flex justify-center items-center h-24`}
              >
                <Loader2Icon className={`animate-spin`} />
              </TableCell>
            </TableRow>
          ) : (
            countries?.data?.map((x: any) => (
              <CountryRow
                key={x.id}
                country={x}
                updateCountry={updateCountry}
                deleteCountry={deleteCountry}
                refetch={refetch}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
