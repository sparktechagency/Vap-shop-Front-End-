"use client";

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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "@/components/core/internal/namer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import LoadingScletion from "@/components/LoadingScletion";
import {
  useGetallbandedusersQuery,
  useUnBanUserMutation,
} from "@/redux/features/admin/AdminApis";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [openUnbanDialog, setOpenUnbanDialog] = React.useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<number | null>(null);
  const per_page = 8;

  const { data, isLoading, refetch } = useGetallbandedusersQuery({
    page,
    per_page,
  });
  const [unBanUser, { isLoading: isUnBanning }] = useUnBanUserMutation();

  const handleUnbanUser = async (userId: number) => {
    setSelectedUser(userId);
    setOpenUnbanDialog(true);
  };

  const confirmUnban = async () => {
    if (!selectedUser) return;

    try {
      const res = await unBanUser({
        id: selectedUser,
        _method: "PUT",
      }).unwrap();

      if (res?.ok) {
        setOpenUnbanDialog(false);
        setOpenSuccessDialog(true);
        refetch(); // Refresh the banned users list
      }
    } catch (error) {
      setOpenUnbanDialog(false);
      setOpenErrorDialog(true);
      console.error("Error unbanning user:", error);
    } finally {
      setSelectedUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-2 p-8">
        {/* Search Skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Table Header Skeleton */}
        <div className="flex justify-between px-4 py-2 bg-gray-100 rounded-md">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Table Rows Skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-4 py-3 border-b"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}

        {/* Pagination Skeleton */}
        <div className="flex justify-end mt-4">
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    );
  }

  const bannedUsers = data?.data?.data || [];
  const paginationInfo = data?.data || {};

  return (
    <div className="h-full w-full !p-8 flex flex-col  items-end border rounded-2xl">
      {/* Unban Confirmation Dialog */}
      <Dialog open={openUnbanDialog} onOpenChange={setOpenUnbanDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Unban</DialogTitle>
            <DialogDescription>
              Are you sure you want to unban this user? They will regain full
              access to their account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenUnbanDialog(false)}
              disabled={isUnBanning}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmUnban}
              disabled={isUnBanning}
            >
              {isUnBanning ? "Processing..." : "Confirm Unban"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onOpenChange={setOpenSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              User has been unbanned successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => setOpenSuccessDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={openErrorDialog} onOpenChange={setOpenErrorDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Failed to unban user. Please try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setOpenErrorDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search and Filter Section */}
      <div className="w-full grid grid-cols-2 mb-6">
        <div className="flex gap-4">
          <Input placeholder="Search by name or email" />
          <Button>Search</Button>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Table className="mb-6">
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
          {bannedUsers.length > 0 ? (
            bannedUsers.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role_label}</Badge>
                </TableCell>
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
                        <DialogTitle>User Details</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-row justify-start items-center gap-4">
                        <Avatar className="size-20">
                          <AvatarImage
                            src={user.avatar}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {user.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="">
                          <Namer type="member" name={user.full_name} />
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between items-center text-sm">
                        <p>Followers: {user.total_followers}</p>
                        <p>Following: {user.total_following}</p>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="col-span-3 text-sm font-semibold">
                          <p>Ban Reason:</p>
                        </div>
                        <div className="col-span-4">
                          <p className="text-sm">
                            {user.ban_reason || "No reason provided"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="col-span-3 text-sm font-semibold">
                          <p>Banned At:</p>
                        </div>
                        <div className="col-span-4">
                          <p className="text-sm">
                            {new Date(user.banned_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="col-span-3 text-sm font-semibold">
                          <p>Review Count:</p>
                        </div>
                        <div className="bg-primary text-background dark:text-foreground text-center text-xs flex justify-center items-center-safe col-span-4 !p-2">
                          {user.total_reviews} reviews (Avg: {user.avg_rating})
                        </div>
                      </div>
                      <div className="grid grid-cols-7">
                        <div className="w-full col-span-3">
                          <Button
                            onClick={() => handleUnbanUser(user.id)}
                            className="w-full"
                            variant="outline"
                            disabled={isUnBanning}
                          >
                            {isUnBanning && selectedUser === user.id
                              ? "Processing..."
                              : "Remove User Ban"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No banned users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>A list of the Banned Users</TableCaption>
      </Table>

      {/* Pagination */}
      {bannedUsers.length > 0 && (
        <div className="w-full flex justify-end items-end">
          <Pagination className="flex justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                />
              </PaginationItem>
              {Array.from({ length: paginationInfo.last_page || 1 }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i + 1 === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < (paginationInfo.last_page || 1))
                      setPage(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
