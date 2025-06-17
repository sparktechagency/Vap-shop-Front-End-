"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCardIcon } from "lucide-react";

// Sample data based on the image
const orders = [
  {
    id: "43656",
    username: "Raven",
    product: "VODOO AUX7 POD",
    paid: "234$",
    showAction: true,
  },
  {
    id: "43656",
    username: "Eve",
    product: "VODOO AUX7 POD",
    paid: "234$",
    showAction: true,
  },
  {
    id: "43656",
    username: "Nilou",
    product: "VODOO AUX7 POD",
    paid: "234$",
    showAction: true,
  },
  {
    id: "43656",
    username: "Nilou",
    product: "VODOO AUX7 POD",
    paid: "234$",
    showAction: true,
  },
];

export default function OrdersTable() {
  return (
    <div className="w-full">
      <Table>
        <TableCaption className="text-center text-gray-500 mt-4">
          Orders and payments
        </TableCaption>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-medium text-gray-600">ID</TableHead>
            <TableHead className="font-medium text-gray-600">
              Username
            </TableHead>
            <TableHead className="font-medium text-gray-600">Product</TableHead>
            <TableHead className="font-medium text-gray-600">Paid</TableHead>
            <TableHead className="font-medium text-gray-600 text-end">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={index} className="border-b border-gray-100">
              <TableCell className="font-normal text-gray-800">
                {order.id}
              </TableCell>
              <TableCell className="font-normal text-gray-800">
                {order.username}
              </TableCell>
              <TableCell className="font-normal text-gray-800">
                {order.product}
              </TableCell>
              <TableCell className="font-normal text-gray-800">
                {order.paid}
              </TableCell>
              <TableCell className="flex justify-end items-center">
                {order.showAction && (
                  <Button
                    variant="default"
                    className="bg-black hover:bg-gray-800 text-white rounded-md !px-4 !py-2 text-sm"
                  >
                    <CreditCardIcon className="h-4 w-4 !mr-2" />
                    View Details
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
