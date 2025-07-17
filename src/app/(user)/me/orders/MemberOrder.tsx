/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
import { useGetCheckoutsQuery } from "@/redux/features/users/userApi";
import { EyeIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CheckOutDetail from "./checkout-detail";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OrderType {
  checkout_date: string;
  checkout_id: string;
  overall_status:
    | "pending"
    | "accepted"
    | "rejected"
    | "partially_accepted"
    | "completed"
    | "delivered"
    | "cancelled";
  grand_total: string;
}

export default function MemberOrder() {
  const { data, isLoading, isError, error } = useGetCheckoutsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const handleViewInvoice = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  if (data) {
    console.log(data.data);
    // return <></>;
  }

  if (error) {
    console.log(error);
  }
  if (!isLoading && !isError) {
    console.log(data);
  }
  if (isError) {
    return (
      <div className="!p-6">
        <div className="h-12 w-full flex justify-center items-center">
          Something went wrong
        </div>
      </div>
    );
  }
  return (
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((x: OrderType) => (
                <TableRow key={x.checkout_id}>
                  <TableCell className="font-medium">{x.checkout_id}</TableCell>
                  <TableCell className="font-medium">
                    {x.checkout_date}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Badge
                      className="capitalize"
                      variant={
                        x.overall_status === "pending"
                          ? "special"
                          : x.overall_status === "accepted"
                          ? "success"
                          : x.overall_status === "partially_accepted"
                          ? "outline"
                          : x.overall_status === "delivered"
                          ? "success"
                          : x.overall_status === "rejected"
                          ? "destructive"
                          : x.overall_status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {x.overall_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${x.grand_total}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      onClick={() => handleViewInvoice(String(x.checkout_id))}
                      variant="outline"
                      size="icon"
                    >
                      <EyeIcon />
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Under development
                      </TooltipContent>
                    </Tooltip>

                    <CheckOutDetail
                      id={selectedOrderId}
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
    </div>
  );
}

// </TableBody>
// <TableRow>
//   <TableCell className="font-medium">325345</TableCell>
//   <TableCell>31-06-2025</TableCell>
//   <TableCell>Vodoo Vape Shop</TableCell>
//   <TableCell>
//     <Badge variant="special">Pending</Badge>
//   </TableCell>
//   <TableCell className="text-right">$250.00</TableCell>
// </TableRow>
// <TableRow>
//   <TableCell className="font-medium">325345</TableCell>
//   <TableCell>31-06-2025</TableCell>
//   <TableCell>Vodoo Vape Shop</TableCell>
//   <TableCell>
//     <Badge variant="success">Delivered</Badge>
//   </TableCell>
//   <TableCell className="text-right">$250.00</TableCell>
// </TableRow>
// <TableRow>
//   <TableCell className="font-medium">325345</TableCell>
//   <TableCell>31-06-2025</TableCell>
//   <TableCell>Vodoo Vape Shop</TableCell>
//   <TableCell>
//     <Badge variant="destructive">Denied</Badge>
//   </TableCell>
//   <TableCell className="text-right">$250.00</TableCell>
// </TableRow>
