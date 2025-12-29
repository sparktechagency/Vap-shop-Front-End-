/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { useGetOrderQuery } from "@/redux/features/users/userApi";
import {
  Dialog,
  DialogContent,
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
import { Package, Receipt, Download } from "lucide-react";
import NextImage from "next/image"; // ✅ renamed import
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price_at_order: string;
  line_total: number;
  product_image: {
    product_image: string;
  };
}

interface InvoiceDetailProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function InvoiceDetail({
  user,
  id,
  isOpen,
  onClose,
}: InvoiceDetailProps) {
  const { data, isLoading } = useGetOrderQuery({ id });
  const orderItems: OrderItem[] = data?.data?.order_items || [];

  const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(invoiceRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const img = new window.Image(); // ✅ using browser Image explicitly
      img.src = dataUrl;

      img.onload = () => {
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (img.height * imgWidth) / img.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`invoice-${id}.pdf`);
      };
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90dvw] lg:min-w-[60dvw] max-h-[80vh] p-0 overflow-y-auto">
        <div className="flex justify-between items-center px-6 pt-6 pb-2">
          <DialogHeader className="p-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Receipt className="h-5 w-5" />
              Invoice Details - Reservation #{id}
            </DialogTitle>
          </DialogHeader>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div
          ref={invoiceRef}
          className="px-6 pb-6 bg-background text-foreground"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  User Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-6 text-sm border-b pb-2">
                  <span className="font-bold">Name:</span>
                  <span>{user.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm border-b pb-2">
                  <span className="font-bold">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm border-b pb-2">
                  <span className="font-bold">Date of birth:</span>
                  <span>{user?.dob ?? ""}</span>
                </div>
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
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-2xl font-bold">{orderItems.length}</span>
              </CardContent>
            </Card>
          </div>

          <ScrollArea className="flex-1">
            <div className="rounded-md border">
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
                  {orderItems.map((item: any, index) => (
                    <TableRow
                      key={item.product_id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="flex items-center gap-4">
                        <NextImage
                          src={
                            typeof item.product_image === "string"
                              ? item.product_image
                              : typeof item.product_image?.product_image ===
                                "string"
                              ? item.product_image.product_image
                              : "/image/shop/item.jpg"
                          }
                          className="size-18 object-cover rounded-lg"
                          height={60}
                          width={60}
                          alt="product"
                        />
                        <div>
                          <span className="font-medium">
                            {item.product_name}
                          </span>
                          <span className="block text-sm text-muted-foreground">
                            ID: {item.product_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-mono">
                          {item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${Number.parseFloat(item.price_at_order).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        ${item.line_total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          <div className="pt-6">
            <Separator className="mb-4" />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {orderItems.length} product
                {orderItems.length !== 1 ? "s" : ""} • {totalItems} item
                {totalItems !== 1 ? "s" : ""}
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  Subtotal
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${subtotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
