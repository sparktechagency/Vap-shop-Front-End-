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
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/users/userApi";
import { EditIcon, EyeIcon, Loader2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import InvoiceDetail from "./invoice-detail";
import { useUser } from "@/context/userContext";

interface OrderType {
  order_id: number;
  order_date: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "partially_accepted"
    | "completed"
    | "delivered"
    | "cancelled";
  sub_total: string;
  customer: {
    name: string;
    email: string;
    address: string;
    dob: string;
  };
}

export default function BuissnessOrder() {
  const { data, isLoading, isError, error } = useGetOrdersQuery<any>();
  const [updateOrder] = useUpdateOrderStatusMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("12345");
  const { role } = useUser();
  const handleViewInvoice = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  if (error) {
    console.log(error);
  }
  if (!isLoading && !isError) {
    console.log(data);
  }

  async function statusChange(
    x: "accepted" | "rejected" | "delivered" | "cancelled",
    id: string
  ) {
    try {
      const call = await updateOrder({
        id,
        body: { _method: "PUT", status: x },
      }).unwrap();
      console.log("--------------------");

      console.log(call);

      if (call?.ok) {
        toast.success(`Order ${x} successfully`);
      } else {
        toast.error(`Failed to update order status`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }
  if (isError && role === 3) {
    return (
      <div className="!p-6">
        <div className="h-12 w-full flex justify-center items-center">
          {"No order found"}
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="!p-6">
        <div className="h-12 w-full flex justify-center items-center">
          {error?.data?.message || "Something went wrong"}
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
          <>
            <Table className="!text-xs">
              <TableCaption>A list of your recent orders.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((x: OrderType) => (
                  <TableRow key={x.order_id}>
                    <TableCell className="font-medium">
                      # {x.order_id}
                    </TableCell>
                    <TableCell>{x.order_date}</TableCell>
                    <TableCell>{x.customer.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Badge
                        className="capitalize"
                        variant={
                          x.status === "pending"
                            ? "special"
                            : x.status === "accepted"
                            ? "success"
                            : x.status === "partially_accepted"
                            ? "outline"
                            : x.status === "delivered"
                            ? "success"
                            : x.status === "rejected"
                            ? "destructive"
                            : x.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {x.status === "delivered" ? "Completed" : x.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${x.sub_total}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline">
                            <EditIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              statusChange("accepted", String(x.order_id));
                            }}
                          >
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              statusChange("rejected", String(x.order_id));
                            }}
                          >
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              statusChange("delivered", String(x.order_id));
                            }}
                          >
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              statusChange("cancelled", String(x.order_id));
                            }}
                            variant="destructive"
                          >
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        onClick={() => handleViewInvoice(String(x.order_id))}
                        variant="outline"
                        size="icon"
                      >
                        <EyeIcon />
                      </Button>
                      <InvoiceDetail
                        user={x.customer}
                        id={selectedOrderId}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                      />
                    </TableCell>
                    <TableCell className="hidden">
                      <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
                        <code className="whitespace-pre-wrap">
                          {JSON.stringify(x, null, 2)}
                        </code>
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
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
