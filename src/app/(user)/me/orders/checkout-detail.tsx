"use client";

import { useState, useEffect } from "react";
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
import {
  Package,
  Receipt,
  User,
  Mail,
  MapPin,
  Calendar,
  Loader2Icon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateInvoiceApiMutation } from "@/redux/features/manage/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

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
  typeof value === "number" ? value : Number.parseFloat(value || "0");

// --- Main Component ---
export default function CheckOutDetail({
  id,
  isOpen,
  onClose,
}: InvoiceDetailProps) {
  const { data, isLoading } = useGetCheckoutQuery({ id });
  const [editableData, setEditableData] = useState<MemberData | null>(null);
  const [updateInvoice, { isLoading: updating }] =
    useUpdateInvoiceApiMutation();
  useEffect(() => {
    if (data?.data) {
      setEditableData(JSON.parse(JSON.stringify(data.data)));
    }
  }, [data]);

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

  const handleQuantityChange = (
    subOrderIndex: number,
    itemIndex: number,
    newQuantity: string | number
  ) => {
    if (!editableData) return;

    const quantity = parseToNumber(newQuantity);
    const updatedData = JSON.parse(JSON.stringify(editableData));
    const item = updatedData.sub_orders[subOrderIndex].order_items[itemIndex];

    // Update quantity and recalculate line total
    item.quantity = quantity;
    item.line_total = quantity * parseToNumber(item.price_at_order);

    // Recalculate sub_total for the order
    const subTotal = updatedData.sub_orders[subOrderIndex].order_items.reduce(
      (sum: number, orderItem: any) =>
        sum + parseToNumber(orderItem.line_total),
      0
    );
    updatedData.sub_orders[subOrderIndex].sub_total = subTotal;

    // Recalculate grand total
    const grandTotal = updatedData.sub_orders.reduce(
      (sum: number, order: any) => sum + parseToNumber(order.sub_total),
      0
    );
    updatedData.grand_total = grandTotal;

    setEditableData(updatedData);
  };
  console.log(data);

  const handleUpdateInvoice = async (checkoutID: string | number) => {
    if (!editableData) return;

    // Prepare the output in the requested format
    const firstCustomer = editableData.sub_orders?.[0]?.customer;
    const allOrderItems =
      editableData.sub_orders?.flatMap((order) => order.order_items) || [];
    const dob = firstCustomer?.dob ? new Date(firstCustomer.dob) : null;

    const customer_dob = dob
      ? `${dob.getDate().toString().padStart(2, "0")}-${(dob.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${dob.getFullYear()}`
      : "";
    const outputData = {
      customer_name: firstCustomer?.name || "",
      customer_email: firstCustomer?.email || "",
      customer_dob,
      customer_phone: "",
      customer_address:
        typeof firstCustomer?.address === "string"
          ? firstCustomer.address
          : firstCustomer?.address?.address || "",
      cart_items: allOrderItems.map((item) => ({
        product_id: item.product_id,
        quantity: parseToNumber(item.quantity),
      })),
    };
    try {
      const res: any = await updateInvoice({
        id: checkoutID,
        body: outputData,
      });

      if (res.data.ok) {
        toast.success(res.data.message ?? "Successfully updated invoice!");
      } else {
        toast.error(res.data.message ?? "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    console.log("[v0] Updated Dataset:", outputData);
    // console.log("[v0] Full Updated Data:", editableData);
  };

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
          {memberData?.sub_orders?.map((subOrder, subOrderIndex) => (
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
                    {subOrder.order_items.map((item: any, itemIndex) => (
                      <TableRow key={itemIndex} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-muted-foreground">
                          {itemIndex + 1}
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
                          <Input
                            type="number"
                            min="0"
                            value={
                              editableData?.sub_orders[subOrderIndex]
                                ?.order_items[itemIndex]?.quantity ||
                              item.quantity
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                subOrderIndex,
                                itemIndex,
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <Input
                            disabled
                            defaultValue={item.price_at_order}
                            className=""
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          $
                          {parseToNumber(
                            editableData?.sub_orders[subOrderIndex]
                              ?.order_items[itemIndex]?.line_total ||
                              item.line_total
                          ).toFixed(2)}
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
                  $
                  {parseToNumber(
                    editableData?.sub_orders[subOrderIndex]?.sub_total ||
                      subOrder.sub_total
                  ).toFixed(2)}
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
                $
                {parseToNumber(editableData?.grand_total || grandTotal).toFixed(
                  2
                )}
              </div>
            </div>
            <div className="">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={updating}>
                    {updating ? (
                      <>
                        <Loader2Icon className="animate-spin" />
                        Updating invoice
                      </>
                    ) : (
                      "Update Invoice"
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm update?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="">
                    <AlertDescription>
                      Please review the changes and make sure you want to update
                      this order
                    </AlertDescription>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleUpdateInvoice(memberData.checkout_id);
                      }}
                    >
                      Confirm & Update
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
          {editableData ? renderMemberInvoice(editableData) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
