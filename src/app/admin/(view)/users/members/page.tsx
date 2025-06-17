import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "@/components/core/internal/namer";
import { Badge } from "@/components/ui/badge";

const users = [
  { id: "43656", username: "Raven", email: "raven@gmail.com", role: "Brand" },
  { id: "43656", username: "Raven", email: "raven@gmail.com", role: "Brand" },
  { id: "43656", username: "Eve", email: "eve@email", role: "Customer" },
  {
    id: "43656",
    username: "Nilou",
    email: "nilou@yahoo.com",
    role: "Wholesaler",
  },
  {
    id: "43656",
    username: "Nilou",
    email: "nilou@yahoo.com",
    role: "Wholesaler",
  },
  {
    id: "43656",
    username: "Nilou",
    email: "nilou@yahoo.com",
    role: "Wholesaler",
  },
  {
    id: "43656",
    username: "Nilou",
    email: "nilou@yahoo.com",
    role: "Wholesaler",
  },
  {
    id: "43656",
    username: "Nilou",
    email: "nilou@yahoo.com",
    role: "Wholesaler",
  },
  {
    id: "43656",
    username: "Nilou",
    email: "nilou@yahoo.com",
    role: "Wholesaler",
  },
];
export default function Page() {
  return (
    <div className="h-full w-full !p-8 flex flex-col justify-between items-end border rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-gray-900 text-white hover:bg-gray-800"
                    >
                      <User className="!mr-2 size-4" />
                      View
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
                    <div className="flex flex-row justify-between items-center text-sm">
                      <p>Followers: 24k</p>
                      <p>Following: 24k</p>
                    </div>
                    <div className="grid grid-cols-7">
                      <div className="col-span-3 text-sm font-semibold">
                        <p>Top Favourite Brands:</p>
                      </div>
                      <div className="grid grid-cols-4 gap-3 col-span-4">
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-7">
                      <div className="col-span-3 text-sm font-semibold">
                        <p>Top Favourite Stores:</p>
                      </div>
                      <div className="grid grid-cols-4 gap-3 col-span-4">
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                        <Badge>SMOK</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-7">
                      <div className="col-span-3 text-sm font-semibold">
                        <p>Review Count:</p>
                      </div>
                      <div className="bg-primary text-background dark:text-foreground text-center text-xs flex justify-center items-center-safe col-span-4 !p-2">
                        476 reviews
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
                              <TableHead>Received</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="!text-xs">
                            <TableRow>
                              <TableCell className="">
                                Geek Vape Aegis..
                              </TableCell>
                              <TableCell>GEEK VAPE</TableCell>
                              <TableCell>29-04-2025</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>A list of the Users</TableCaption>
      </Table>
      <div className="w-full flex justify-end items-end">
        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
