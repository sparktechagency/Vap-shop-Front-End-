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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "@/components/core/internal/namer";

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="bg-black hover:bg-gray-800 text-white rounded-md !px-4 !py-2 text-sm"
                      >
                        <CreditCardIcon className="h-4 w-4 !mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="!max-w-[40dvw]">
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-row justify-start items-center gap-4">
                        <Avatar className="size-20">
                          <AvatarImage
                            src="/image/icon/user.jpeg"
                            className="object-cover"
                          />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div className="">
                          <Namer type="member" name="Jay Smith" />
                          <p className="text-xs text-muted-foreground">
                            jaysmith@email.com
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="col-span-3 text-sm font-semibold">
                          <p>Payment amount:</p>
                        </div>
                        <div className="font-semibold border rounded w-fit p-2!">
                          $43
                        </div>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="col-span-3 text-sm font-semibold">
                          <p>Order information:</p>
                        </div>
                        <div className="text-xs flex justify-center items-center-safe col-span-4 !p-2">
                          <Table>
                            <TableHeader className="text-xs">
                              <TableRow>
                                <TableHead>Purchased</TableHead>
                                <TableHead>From</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="!text-xs">
                              <TableRow>
                                <TableCell className="">
                                  Geek Vape Aegis..
                                </TableCell>
                                <TableCell>GEEK VAPE</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
