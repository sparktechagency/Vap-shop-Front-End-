"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
import { useGetOrdersQuery } from "@/redux/features/users/userApi";
import { Loader2Icon } from "lucide-react";
export default function Page() {
  const { data, isLoading, isError } = useGetOrdersQuery();
  if (data) {
    console.log(data);
  }

  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Orders</h1>
      <Separator />
      <div className="!my-12">
        {isLoading && (
          <div className="h-24 w-full flex items-center justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
        {!isError &&
          !isLoading &&
          (data.data.length <= 0 ? (
            <div className="h-24 w-full flex justify-center items-center text-sm font-semibold text-purple-700">
              No order is made yet
            </div>
          ) : (
            <Table className="!text-xs">
              <TableCaption>A list of your recent orders.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
            </Table>
          ))}
      </div>
    </div>
  );
}

//   <TableRow>
//     <TableCell className="font-medium">325345</TableCell>
//     <TableCell>31-06-2025</TableCell>
//     <TableCell>Vodoo Vape Shop</TableCell>
//     <TableCell>
//       <Badge variant="special">Pending</Badge>
//     </TableCell>
//     <TableCell className="text-right">$250.00</TableCell>
//   </TableRow>
//   <TableRow>
//     <TableCell className="font-medium">325345</TableCell>
//     <TableCell>31-06-2025</TableCell>
//     <TableCell>Vodoo Vape Shop</TableCell>
//     <TableCell>
//       <Badge variant="success">Delivered</Badge>
//     </TableCell>
//     <TableCell className="text-right">$250.00</TableCell>
//   </TableRow>
//   <TableRow>
//     <TableCell className="font-medium">325345</TableCell>
//     <TableCell>31-06-2025</TableCell>
//     <TableCell>Vodoo Vape Shop</TableCell>
//     <TableCell>
//       <Badge variant="destructive">Denied</Badge>
//     </TableCell>
//     <TableCell className="text-right">$250.00</TableCell>
//   </TableRow>
// </TableBody>
