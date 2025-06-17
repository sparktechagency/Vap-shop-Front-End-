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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
            <TableRow className="bg-gray-50 dark:bg-zinc-900">
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
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex flex-row items-center gap-3 !text-sm">
                          <Avatar>
                            <AvatarImage src="/image/icon/brand.jpg" />
                            <AvatarFallback>UI</AvatarFallback>
                          </Avatar>
                          SMOK
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        Datas about the account
                      </DialogDescription>
                      <DialogFooter>
                        <Button variant="destructive">Ban</Button>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
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
