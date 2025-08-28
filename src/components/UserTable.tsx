
'use client';

import React, { useState, useEffect } from "react";
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
// UPDATED: Added Clock icon for the suspend button
import { Bell, User, Trash2, Clock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Namer from "@/components/core/internal/namer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// UPDATED: Added useSuspendUserMutation. You need to create this in your Redux slice.
import { useBanAuserMutation, useDeleteUserMutation, useGetallusersQuery, useNotifyuserMutation, useSuspendUserMutation, useUnsuspanduserMutation } from "@/redux/features/admin/AdminApis";
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
import { Skeleton } from "./ui/skeleton";
import { Label } from "@/components/ui/label";

// --- Interfaces ---
export interface Address {
    address_id: number;
    address: string | null;
    zip: string | null;
    region_id: number;
    region: string | null;
    country: string | null;
}

export interface FavouriteStore {
    id: number;
    full_name: string;
}

export interface FavouriteBrand {
    id: number;
    name: string;
}

export interface UserData {
    id: number;
    first_name: string;
    last_name: string | null;
    full_name: string;
    email: string;
    phone: string | null;
    dob: string | null;
    avatar: string;
    role: number;
    role_label: string;
    total_followers: number;
    total_following: number;
    avg_rating: number;
    total_reviews: number;
    is_banned: boolean;
    is_suspended?: boolean;
    created_at: string;
    updated_at: string;
    is_favourite: boolean;
    is_active: boolean;
    ein: string | null;
    is_following: boolean;
    address: Address | null; // 🔥 this is now an object, not a string
    favourite_stores: FavouriteStore[];
    favourite_brands: FavouriteBrand[];
    invoice_status?: string;
    remaining_days?: number;
}

interface UserTableProps {
    role: number;
    tableCaption?: string;
}

// --- Component ---
const UserTable: React.FC<UserTableProps> = ({ role, tableCaption = "A list of the Users" }) => {
    // --- State Management ---
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const per_page = 20;

    const [viewingUser, setViewingUser] = useState<UserData | null>(null);
    console.log('viewingUser', viewingUser);

    // Dialog states
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
    // ADDED: State for the suspend dialog
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);


    // State for selected user and action-specific data
    const [selectedUser, setSelectedUser] = useState<{ id: number; isBanned: boolean } | null>(null);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState<number | null>(null);
    const [selectedUserForNotify, setSelectedUserForNotify] = useState<number | null>(null);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    // ADDED: State for suspend action
    const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<number | null>(null);
    const [suspensionDays, setSuspensionDays] = useState("");
    const [suspensionReason, setSuspensionReason] = useState("");
    console.log('selectedUserForSuspend', selectedUserForSuspend);


    // --- Debounce Search Term ---
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // --- RTK Query Hooks ---
    const { data, isLoading, refetch } = useGetallusersQuery({ page, per_page, role, searchterm: debouncedSearchTerm });
    const [banAuser, { isLoading: isBanning }] = useBanAuserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [notifyUser, { isLoading: isNotifying }] = useNotifyuserMutation();
    // ADDED: RTK Query hook for suspending a user
    const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
    const [unsuspendUser, { isLoading: isUnsuspending }] = useUnsuspanduserMutation();
    // --- Data ---
    const users = data?.data || [];
    const totalPages = data?.meta?.last_page || 1;
    console.log('users', users);

    // --- Event Handlers ---
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Ban Dialog Logic
    const openBanDialog = (userId: number, isCurrentlyBanned: boolean) => {
        setSelectedUser({ id: userId, isBanned: isCurrentlyBanned });
        setBanDialogOpen(true);
    };

    const handleBanUser = async () => {
        if (!selectedUser) return;
        try {
            const res = await banAuser({ id: selectedUser.id, _method: "PUT" }).unwrap();
            toast.success(res?.message || "User status updated successfully");
            await refetch();
            setViewingUser(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "An error occurred");
        } finally {
            setBanDialogOpen(false);
            setSelectedUser(null);
        }
    };

    // Delete Dialog Logic
    const openDeleteDialog = (userId: number) => {
        setSelectedUserForDelete(userId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!selectedUserForDelete) return;
        try {
            const res = await deleteUser({ id: selectedUserForDelete }).unwrap();
            toast.success(res?.message || "User deleted successfully");
            await refetch();
            setViewingUser(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "An error occurred");
        } finally {
            setDeleteDialogOpen(false);
            setSelectedUserForDelete(null);
        }
    };

    // Notify Dialog Logic
    const openNotifyDialog = (userId: number) => {
        setSelectedUserForNotify(userId);
        setNotifyDialogOpen(true);
    };

    const handleNotifyUser = async () => {
        if (!selectedUserForNotify || !notificationTitle.trim() || !notificationMessage.trim()) {
            toast.error("Notification title and message cannot be empty.");
            return;
        }
        try {
            const payload = { user_id: selectedUserForNotify, title: notificationTitle, description: notificationMessage };
            const res = await notifyUser({ user_id: selectedUserForNotify, body: payload }).unwrap();
            toast.success(res?.message || "Notification sent successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send notification.");
        } finally {
            setNotifyDialogOpen(false);
            setNotificationTitle("");
            setNotificationMessage("");
            setSelectedUserForNotify(null);
        }
    };

    // ADDED: Suspend Dialog Logic
    const openSuspendDialog = (userId: number) => {
        setSelectedUserForSuspend(userId);
        setSuspendDialogOpen(true);
    };

    const handleSuspendUser = async () => {
        if (!selectedUserForSuspend || !suspensionDays.trim() || !suspensionReason.trim()) {
            toast.error("Suspension days and reason cannot be empty.");
            return;
        }
        try {
            const payload = {
                days: parseInt(suspensionDays, 10),
                reason: suspensionReason,
            };
            // Note: Adjust the payload structure based on your API requirements
            const res = await suspendUser({ user_id: selectedUserForSuspend, body: payload }).unwrap();
            toast.success(res?.message || "User suspended successfully!");
            await refetch();
            setViewingUser(null); // Close the main user detail view
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to suspend user.");
        } finally {
            // Reset and close the suspend dialog
            setSuspendDialogOpen(false);
            setSuspensionDays("");
            setSuspensionReason("");
            setSelectedUserForSuspend(null);
        }
    };

    // FIXED: Corrected the unsuspend logic
    const handleUnsuspend = async (userId: number | undefined) => {
        // 1. Add a check to ensure we have a user ID
        if (!userId) {
            toast.error("Could not find user to unsuspend.");
            return;
        }
        try {
            // 2. Pass the correct payload to the mutation
            const res = await unsuspendUser({ user_id: userId }).unwrap();

            // 3. The .unwrap() handles errors, so no need for 'if (response.ok)'
            toast.success(res?.message || "User unsuspended successfully!");
            await refetch();
            setViewingUser(null);

        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to unsuspend user.");
        }
    }

    // --- Render Logic ---
    if (isLoading && !data) {
        return (
            <div className="w-full space-y-2 p-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="h-full w-full !p-8 flex flex-col justify-between items-start border rounded-2xl">
            <div className="w-full mb-4">
                <div className="flex gap-4 w-full max-w-sm">
                    <Input placeholder="Search by name, email, or ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <Table>
                <TableCaption>{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>invoice_status</TableHead>
                        <TableHead>remaining_days</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: UserData) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>

                            <TableCell>{user?.invoice_status ? user.invoice_status : "N/A"}</TableCell>
                            <TableCell>{user?.remaining_days ? user.remaining_days + " days" : "N/A"}</TableCell>


                            <TableCell>{user.role_label}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="secondary" size="sm" className="bg-gray-900 text-white hover:bg-gray-800" onClick={() => setViewingUser(user)}>
                                    <User className="mr-2 size-4" /> View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => openNotifyDialog(user.id)}>
                                    <Bell className="mr-2 size-4" /> Notify
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="w-full flex justify-end items-end mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }} isActive={page > 1} />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (page <= 3) pageNum = i + 1;
                            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = page - 2 + i;
                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }} isActive={pageNum === page}>
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        {totalPages > 5 && page < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }} isActive={page < totalPages} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* --- Modals & Dialogs --- */}
            <Dialog open={!!viewingUser} onOpenChange={(isOpen) => !isOpen && setViewingUser(null)}>
                {viewingUser && (
                    <DialogContent className="!max-w-[40dvw] max-h-[95vh] overflow-y-auto space-y-4">

                        <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
                            {/* Header with Avatar and Name */}
                            <div className="flex items-center space-x-4">
                                <img
                                    src={viewingUser?.avatar}
                                    alt="User Avatar"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{viewingUser?.full_name}</h2>
                                    <p className="text-sm text-gray-500">{viewingUser?.role_label}</p>
                                </div>
                            </div>

                            {/* Grid Information */}
                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                    <p className="font-semibold">First Name:</p>
                                    <p>{viewingUser?.first_name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Last Name:</p>
                                    <p>{viewingUser?.last_name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Email:</p>
                                    <p>{viewingUser?.email}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Phone:</p>
                                    <p>{viewingUser?.phone}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">EIN:</p>
                                    <p>{viewingUser?.ein || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Date of Birth:</p>
                                    <p>{viewingUser?.dob || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Average Rating:</p>
                                    <p>{viewingUser?.avg_rating}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Total Reviews:</p>
                                    <p>{viewingUser?.total_reviews}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Total Followers:</p>
                                    <p>{viewingUser?.total_followers}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Total Following:</p>
                                    <p>{viewingUser?.total_following}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Is Following:</p>
                                    <p>{viewingUser?.is_following ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Is Favourite:</p>
                                    <p>{viewingUser?.is_favourite ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Banned:</p>
                                    <p>{viewingUser?.is_banned ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Suspended:</p>
                                    <p>{viewingUser?.is_suspended ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Joined:</p>
                                    <p>{new Date(viewingUser?.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Last Updated:</p>
                                    <p>{new Date(viewingUser?.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="pt-4">
                                <h3 className="text-md font-semibold text-gray-800 mb-2">Address</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                    <div>
                                        <p className="font-semibold">Address:</p>
                                        <p>{viewingUser?.address?.address}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Region:</p>
                                        <p>{viewingUser?.address?.region}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Region ID:</p>
                                        <p>{viewingUser?.address?.region_id}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Country:</p>
                                        <p>{viewingUser?.address?.country}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">ZIP Code:</p>
                                        <p>{viewingUser?.address?.zip || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Favourites Section */}

                        </div>





                        <div className="space-y-2">
                            <div className="grid grid-cols-7 items-center">
                                <p className="col-span-3 text-sm font-semibold">Favorite Brands:</p>
                                <div className="col-span-4 flex flex-wrap gap-2">
                                    {viewingUser.favourite_brands?.length > 0 ? (
                                        viewingUser.favourite_brands.map((brand) => <Badge key={brand.id}>{brand.name}</Badge>)
                                    ) : <Badge variant="outline">None</Badge>}
                                </div>
                            </div>
                            <div className="grid grid-cols-7 items-center">
                                <p className="col-span-3 text-sm font-semibold">Favorite Stores:</p>
                                <div className="col-span-4 flex flex-wrap gap-2">
                                    {viewingUser.favourite_stores?.length > 0 ? (
                                        viewingUser.favourite_stores.map((store) => <Badge key={store.id}>{store.full_name}</Badge>)
                                    ) : <Badge variant="outline">None</Badge>}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 items-center">
                            <p className="col-span-3 text-sm font-semibold">Review Count:</p>
                            <div className="col-span-4 text-center text-xs p-2 bg-primary text-primary-foreground rounded-md">
                                {viewingUser.total_reviews} reviews (Avg: {viewingUser.avg_rating.toFixed(1)}⭐)
                            </div>
                        </div>
                        {/* UPDATED: DialogFooter with Suspend Button */}
                        <DialogFooter className="sm:justify-center mt-4">
                            {/* UPDATED: Combined Suspend/Unsuspend Button */}
                            <Button
                                className={`flex-1 ${viewingUser.is_suspended ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
                                disabled={isSuspending || isUnsuspending}
                                onClick={() => {
                                    if (viewingUser.is_suspended) {
                                        // Pass the ID directly from the user object in view
                                        handleUnsuspend(viewingUser.id);
                                    } else {
                                        // This flow is correct, it opens the suspend dialog
                                        openSuspendDialog(viewingUser.id);
                                    }
                                }}
                            >
                                <Clock className="mr-2 size-4" />
                                {isUnsuspending ? 'Processing...' : (viewingUser.is_suspended ? 'Unsuspend User' : 'Suspend User')}
                            </Button>

                            {/* Ban Button - Renders if user is not banned */}
                            {!viewingUser.is_banned && (
                                <Button
                                    className="flex-1"
                                    variant={"destructive"}
                                    onClick={() => openBanDialog(viewingUser.id, viewingUser.is_banned)}
                                    disabled={isBanning}
                                >
                                    {isBanning ? 'Processing...' : 'Ban User'}
                                </Button>
                            )}

                            {/* Delete Button */}
                            <Button
                                className="flex-1"
                                variant="destructive"
                                onClick={() => openDeleteDialog(viewingUser.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting && selectedUserForDelete === viewingUser.id ? 'Deleting...' : 'Delete User'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>

            {/* Ban Confirmation Dialog */}
            <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser?.isBanned ? "This will unban the user." : "This will ban the user."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBanUser} disabled={isBanning}>
                            {isBanning ? 'Processing...' : `Yes, ${selectedUser?.isBanned ? 'Unban' : 'Ban'}`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the user.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Notify User Dialog */}
            <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Notification</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label htmlFor="notification-title" className="text-right">Title</Label>
                            <Input id="notification-title" value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} className="mt-2" placeholder="Enter notification title" />
                        </div>
                        <div>
                            <Label htmlFor="notification-message" className="text-right">Message</Label>
                            <Textarea id="notification-message" placeholder="Type your notification message here..." value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)} rows={5} className="mt-2" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button onClick={handleNotifyUser} disabled={isNotifying}>
                            {isNotifying ? "Sending..." : "Send Notification"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADDED: Suspend User Dialog */}
            <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Suspend User</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label htmlFor="suspension-days" className="text-right">Days</Label>
                            <Input
                                id="suspension-days"
                                type="number"
                                value={suspensionDays}
                                onChange={(e) => setSuspensionDays(e.target.value)}
                                className="mt-2"
                                placeholder="e.g., 7"
                                min="1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="suspension-reason" className="text-right">Reason for Suspension</Label>
                            <Textarea
                                id="suspension-reason"
                                placeholder="Provide a reason for suspending the user..."
                                value={suspensionReason}
                                onChange={(e) => setSuspensionReason(e.target.value)}
                                rows={5}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button onClick={handleSuspendUser} disabled={isSuspending} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                            {isSuspending ? "Suspending..." : "Confirm Suspension"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default UserTable;