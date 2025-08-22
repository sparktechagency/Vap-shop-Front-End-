/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetCheckoutQuery } from "@/redux/features/users/userApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Receipt, User, Mail, MapPin, Calendar } from "lucide-react";
import Image from "next/image";

// --- Type Definitions ---

interface OrderItem {
  product_id: string | number;
  product_name: string;
  quantity: string | number;
  price_at_order: string | number;
  line_total: string | number;
}

interface Customer {
  name: string;
  email: string;
  dob: string;
  address: { address: string };
}

interface SubOrder {
  order_id: string | number;
  status: string;
  sub_total: string | number;
  order_date: string;
  customer: Customer;
  order_items: OrderItem[];
}

interface MemberData {
  checkout_id: string | number;
  grand_total: string | number;
  overall_status: string;
  checkout_date: string;
  sub_orders: SubOrder[];
}

interface InvoiceDetailProps {
  id: string | number;
  isOpen: boolean;
  onClose: () => void;
}

// --- Helper Function ---
const parseToNumber = (value: string | number | undefined | null): number =>
  typeof value === "number" ? value : parseFloat(value || "0");

// --- Main Component ---
export default function CheckOutDetail({
  id,
  isOpen,
  onClose,
}: InvoiceDetailProps) {
  const { data, isLoading } = useGetCheckoutQuery({ id });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const renderMemberInvoice = (memberData: MemberData) => {
    const allOrderItems =
      memberData.sub_orders?.flatMap((order) => order.order_items) || [];
    const totalItems = allOrderItems.reduce(
      (sum, item) => sum + parseToNumber(item.quantity),
      0
    );
    const grandTotal = parseToNumber(memberData.grand_total);
    const customer = memberData.sub_orders?.[0]?.customer;

    return (
      <>
        <DialogHeader className="p-6">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5" />
            Invoice Details - Checkout
          </DialogTitle>
          <DialogDescription>
            ID: {String(memberData.checkout_id)}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          {customer && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>DOB: {customer.dob ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{String(customer.address.address ?? "N/A")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge
                  variant={
                    memberData.overall_status === "pending"
                      ? "secondary"
                      : "default"
                  }
                  className="capitalize"
                >
                  {memberData.overall_status}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{totalItems}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sub Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-2xl font-bold">
                  {memberData.sub_orders?.length || 0}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Table */}
        <ScrollArea className="flex-1 px-6">
          {memberData?.sub_orders?.map((subOrder) => (
            <div key={subOrder.order_id} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">
                  Sub Order #{String(subOrder.order_id)}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{subOrder.order_date}</span>
                  <Badge variant="outline" className="capitalize">
                    {subOrder.status}
                  </Badge>
                </div>
              </div>

              <div className="rounded-md border mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-center w-20">Qty</TableHead>
                      <TableHead className="text-right w-24">Price</TableHead>
                      <TableHead className="text-right w-24">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subOrder.order_items.map((item: any, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Image
                              src={
                                item.product_image?.startsWith("http")
                                  ? item.product_image
                                  : "/image/shop/item.jpg"
                              }
                              className="size-8 object-cover rounded-lg"
                              height={100}
                              width={100}
                              alt="icon"
                            />

                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.product_name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ID: {String(item.product_id)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="font-mono">
                            {parseToNumber(item.quantity)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${parseToNumber(item.price_at_order).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          ${parseToNumber(item.line_total).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="text-right mb-4">
                <span className="text-sm text-muted-foreground">
                  Sub Total:{" "}
                </span>
                <span className="font-semibold">
                  ${parseToNumber(subOrder.sub_total).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Separator className="mb-4" />
          <div className="flex justify-between items-center">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                Grand Total
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${grandTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent className="min-w-[90dvw] lg:min-w-[60dvw] max-h-[80vh] p-0 overflow-hidden">
        <div className="max-h-[80vh] overflow-auto pb-8">
          {data?.data?.sub_orders
            ? renderMemberInvoice(data.data as MemberData)
            : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
