import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
export default function Page() {
  return (
    <div className="!p-6">
      <h1 className="text-3xl !pb-4">Orders</h1>
      <Separator />
      <div className="!my-12">
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
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">325345</TableCell>
              <TableCell>31-06-2025</TableCell>
              <TableCell>Vodoo Vape Shop</TableCell>
              <TableCell>
                <Badge variant="special">Pending</Badge>
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">325345</TableCell>
              <TableCell>31-06-2025</TableCell>
              <TableCell>Vodoo Vape Shop</TableCell>
              <TableCell>
                <Badge variant="success">Delivered</Badge>
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">325345</TableCell>
              <TableCell>31-06-2025</TableCell>
              <TableCell>Vodoo Vape Shop</TableCell>
              <TableCell>
                <Badge variant="destructive">Denied</Badge>
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-medium">Total</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">$2550.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
