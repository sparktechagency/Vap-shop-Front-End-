'use client';

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useBanAuserMutation, useGetallusersQuery } from "@/redux/features/admin/AdminApis";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserData {
    id: number;
    first_name: string;
    last_name: string | null;
    email: string;
    role: number;
    avatar: string;
    full_name: string;
    role_label: string;
    total_followers: number;
    total_following: number;
    avg_rating: number;
    total_reviews: number;
    phone: string | null;
    is_banned: boolean;
    favourite_stores: { id: number; full_name: string }[];
    favourite_brands: { id: number; name: string }[];
}

interface UserTableProps {
    role: number;
    tableCaption?: string;
}

const UserTable: React.FC<UserTableProps> = ({ role, tableCaption = "A list of the Users" }) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const per_page = 8;
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: number, isBanned: boolean } | null>(null);

    const { data, isLoading, refetch } = useGetallusersQuery({ page, per_page, role });
    const [banAuser, { isLoading: isBanning }] = useBanAuserMutation();
    console.log('data', data);
    const filteredUsers = data?.data?.filter((user: UserData) =>
        user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.id?.toString().includes(searchTerm)
    ) || [];

    const totalPages = data?.meta?.last_page || 1;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const openBanDialog = (userId: number, isCurrentlyBanned: boolean) => {
        setSelectedUser({ id: userId, isBanned: isCurrentlyBanned });
        setBanDialogOpen(true);
    };

    const handleBanUser = async () => {
        if (!selectedUser) return;

        try {
            const res = await banAuser({ id: selectedUser.id, _method: "PUT" }).unwrap();
            if (res?.ok) {
                toast.success(res?.message || "User banned successfully");
                setBanDialogOpen(false);
                refetch();

            } else {
                toast.error(res?.message || "Failed to ban user");
            }

        } catch (error) {
            console.error("Failed to ban user", error);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    return (
        <div className="h-full w-full !p-8 flex flex-col justify-between items-end border rounded-2xl">
            <div className="w-full grid grid-cols-2">
                <div className="flex gap-4">
                    <Input
                        placeholder="Search here"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
            </div>

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
                    {filteredUsers.map((user: UserData) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role_label}</TableCell>
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
                                                    src={user.avatar || "/image/icon/user.jpeg"}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback>
                                                    {user.full_name?.charAt(0) || 'U'}
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

                                        {/* Favorite Brands */}
                                        <div className="grid grid-cols-7">
                                            <div className="col-span-3 text-sm font-semibold">
                                                <p>Favorite Brands:</p>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3 col-span-4">
                                                {user.favourite_brands?.length > 0 ? (
                                                    user.favourite_brands.map((brand) => (
                                                        <Badge key={brand.id}>{brand.name}</Badge>
                                                    ))
                                                ) : (
                                                    <Badge variant="outline">None</Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Favorite Stores */}
                                        <div className="grid grid-cols-7">
                                            <div className="col-span-3 text-sm font-semibold">
                                                <p>Favorite Stores:</p>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3 col-span-4">
                                                {user.favourite_stores?.length > 0 ? (
                                                    user.favourite_stores.map((store) => (
                                                        <Badge key={store.id}>{store.full_name}</Badge>
                                                    ))
                                                ) : (
                                                    <Badge variant="outline">None</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7">
                                            <div className="col-span-3 text-sm font-semibold">
                                                <p>Review Count:</p>
                                            </div>
                                            <div className="bg-primary text-background dark:text-foreground text-center text-xs flex justify-center items-center-safe col-span-4 !p-2">
                                                {user.total_reviews} reviews (Avg: {user.avg_rating.toFixed(1)}⭐)
                                            </div>
                                        </div>

                                        <div className="w-full mt-4">
                                            <Button

                                                className="w-full"
                                                variant={user.is_banned ? "default" : "destructive"}
                                                onClick={() => openBanDialog(user.id, user.is_banned)}
                                                disabled={user.is_banned || isBanning}
                                            >
                                                {isBanning ? 'Processing...' :
                                                    user.is_banned ? 'user is banned' : 'Ban User'}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption>{tableCaption}</TableCaption>
            </Table>

            {/* Ban/Unban Confirmation Dialog */}
            <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser?.isBanned ?
                                "This will unban the user and allow them to access the platform again." :
                                "This will ban the user and prevent them from accessing the platform."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBanUser}
                            disabled={isBanning}
                        >
                            {isBanning ? 'Processing...' :
                                selectedUser?.isBanned ? 'Yes, Unban' : 'Yes, Ban'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="w-full flex justify-end items-end">
                <Pagination className="flex justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page - 1);
                                }}
                                isActive={page > 1}
                            />
                        </PaginationItem>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }

                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(pageNum);
                                        }}
                                        isActive={pageNum === page}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        {totalPages > 5 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page + 1);
                                }}
                                isActive={page < totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default UserTable;