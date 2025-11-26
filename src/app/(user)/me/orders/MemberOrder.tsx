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
  useCancelCheckoutMutation,
  useGetCheckoutsQuery,
} from "@/redux/features/users/userApi";
import { EyeIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CheckOutDetail from "./checkout-detail";
import { toast } from "sonner";
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
  const [cancelOrder] = useCancelCheckoutMutation();

  const handleViewInvoice = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to cancel this order?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          This action will cancel your order and it cannot be
                          undone. If you proceed, the order will be removed from
                          your purchases and any ongoing processing will be
                          stopped.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, Keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                const res = await cancelOrder({
                                  id: String(x.checkout_id),
                                }).unwrap();
                                if (!res.ok) {
                                  toast.error(
                                    res.message ?? "Failed to Cancel Order"
                                  );
                                } else {
                                  toast.success(
                                    res.message ?? "Cancelled your order"
                                  );
                                }
                              } catch (error: any) {
                                // console.error(error);
                                toast.error(
                                  error.data.message ?? "Something went wrong"
                                );
                              }
                            }}
                          >
                            Cancel Order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

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
