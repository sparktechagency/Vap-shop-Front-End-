import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "@/components/core/internal/namer";
const users = [
  { id: "43656", username: "Raven", email: "raven@mail.com", role: "Brand" },
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
];

export default function Page() {
  return (
    <div className="h-full w-full rounded-xl border !p-6">
      <div className="grid grid-cols-2">
        <div className="flex gap-4">
          <Input placeholder="Search here" />
          <Button>Search</Button>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Name</SelectItem>
              <SelectItem value="dark">ID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="!mt-12">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="w-[100px] font-medium">User ID</TableHead>
              <TableHead className="font-medium">Username</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Role</TableHead>
              <TableHead className="text-right font-medium">Action</TableHead>
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
                        className="bg-zinc-900 text-white hover:bg-zinc-800"
                      >
                        <Eye className="mr-2 h-4 w-4" />
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
                          <p>Review Count:</p>
                        </div>
                        <div className="bg-primary text-background dark:text-foreground text-center text-xs flex justify-center items-center-safe col-span-4 !p-2">
                          476 reviews
                        </div>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="col-span-3 text-sm font-semibold">
                          <p>Subscription information:</p>
                        </div>
                        <div className="text-xs flex justify-center items-center-safe col-span-4 !p-2">
                          <Table>
                            <TableHeader className="text-xs">
                              <TableRow>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Started since</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="!text-xs">
                              <TableRow>
                                <TableCell className="">
                                  📊 Business Intelligence Tools
                                </TableCell>
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
        </Table>
      </div>
    </div>
  );
}
