"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, Loader2Icon, Trash2Icon } from "lucide-react";

import React from "react";
import { useGetSubscriptionDetailsQuery } from "@/redux/features/store/SubscriptionApi";
import { toast } from "sonner";
import {
  useCancelConnectMutation,
  useGetLocationsQuery,
} from "@/redux/features/others/otherApi";
import { useUser } from "@/context/userContext";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddLocation from "./add-location";

export default function Page() {
  const my = useUser();

  const [deleteLocation] = useCancelConnectMutation();
  const { data, isLoading } = useGetLocationsQuery();

  return (
    <section className="border-t p-6">
      <h1 className="text-center text-3xl font-semibold mb-6">
        Manage Connected Locations
      </h1>

      <div className="py-6 flex justify-end">
        <AddLocation />
      </div>

      {/* Dummy Table */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.data?.map((x: any, i: any) => (
                <TableRow key={i}>
                  <TableCell>#{x.id}</TableCell>
                  <TableCell className="font-semibold">
                    {x.branch_name}
                  </TableCell>
                  <TableCell>{x?.address?.address}</TableCell>
                  <TableCell>
                    {x.is_active ? (
                      <Badge variant={"success"}>Active</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Inctive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this location?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          This action will permanently remove the location and
                          cannot be undone. Please confirm if you wish to
                          proceed.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                const call: any = await deleteLocation({
                                  id: x.id,
                                });
                                if (!call.ok) {
                                  toast.error(
                                    call.data.message ?? "Can't be Deleted"
                                  );
                                } else {
                                  toast.success(
                                    call.message ??
                                      "Successfully Deleted Location"
                                  );
                                }
                              } catch {
                                // console.error(error);
                                toast.error("Can't be Deleted");
                              }
                            }}
                          >
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </section>
  );
}

const Subscription = () => {
  // Fetch subscription and add-on data
  const { data: subscriptionDetails, isLoading: isLoadingSubscription } =
    useGetSubscriptionDetailsQuery({ type: "store" });
  // --- Memoized Data Extraction ---
  const subscription = subscriptionDetails?.data?.[0];
  console.log(subscriptionDetails);
  if (isLoadingSubscription) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  return (
    <>
      <section className="w-full rounded-lg bg-white border-2 border-solid border-blue-600 p-6 md:p-8 relative my-6">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          BUSINESS PLAN
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
          {/* Left Side */}
          <div className="flex flex-col">
            <b className="text-lg text-blue-600">{subscription.name}</b>
            <p className="mt-2 text-base text-zinc-500">
              {subscription.description}
            </p>
            <div className="mt-4 text-4xl md:text-6xl font-semibold text-black">
              ${parseFloat(subscription.price).toFixed(0)}/month
            </div>
            <p className="mt-1 text-sm text-zinc-500">Per location</p>
          </div>
          {/* Right Side */}
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
            <h3 className="font-semibold text-base">Included Features:</h3>
            <ul className="mt-4 space-y-4 text-sm">
              {/* Original detailed features can be re-added here if API features are supplementary */}
              {subscription.features && subscription.features.length > 0 ? (
                subscription.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="flex-1">{feature}</span>
                  </li>
                ))
              ) : (
                <p className="text-zinc-500">
                  No features listed for this plan.
                </p>
              )}
            </ul>
          </div>
        </div>
      </section>
      <div className="mt-12 flex justify-end items-center">
        <Button type="submit">Accept & Submit Location</Button>
      </div>
    </>
  );
};
