// 'use client';

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import React, { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useApproveAddMutation, useGetallAddRequestQuery } from "@/redux/features/admin/AdminApis";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { format } from "date-fns";
// import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// import { toast } from "sonner";

// interface AdProduct {
//   id: number;
//   product_id: number;
//   product_name: string;
//   product_image: string;
//   user_id: number;
//   requested_by: string;
//   requested_at: string;
//   amount: string;
//   approved_by: string | null;
//   rejected_by: string | null;
//   rejection_reason: string | null;
//   approved_at: string | null;
//   rejected_at: string | null;
//   display_order: number;
//   status: "approved" | "pending" | "rejected";
//   preferred_duration: string | null;
//   is_active: boolean;
//   start_date: string | null;
//   end_date: string | null;
//   remaining_days: number | null;
//   created_at: string;
//   updated_at: string;
// }

// export default function AdProductsPage() {
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string>("all");
//   const per_page = 8;

//   const { data, isLoading, isError, refetch } = useGetallAddRequestQuery({
//     page,
//     per_page,
//     type: "products",
//   });
//   const [approveAdd, { isLoading: isApproving }] = useApproveAddMutation();
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setPage(1);
//   };


//   const handleStatusChange = async (id: string) => {
//     try {
//       const response = await approveAdd({ id, status: "approved", type: "products", is_active: '1' }).unwrap();
//       console.log('response', response);
//       if (response?.ok) {
//         toast.success('Status changed successfully');
//         refetch();
//       }
//     } catch (error) {
//       console.log('error', error);
//       toast.error('Failed to change status');
//     }
//   };
//   const handleReject = async (id: string) => {
//     try {
//       const response = await approveAdd({ id, status: "rejected", type: "products", is_active: '0' }).unwrap();
//       console.log('response', response);
//       if (response?.ok) {
//         toast.success('Status changed successfully');
//         refetch();
//       }
//     } catch (error) {
//       console.log('error', error);
//       toast.error('Failed to change status');
//     }
//   };


//   const handleViewDetails = (ad: AdProduct) => {


//     console.log('ad', ad);


//     // Handle view details logic here
//   };

//   const handlePageChange = (newPage: number) => {
//     const lastPage = data?.meta?.last_page || 1;
//     if (newPage >= 1 && newPage <= lastPage) {
//       setPage(newPage);
//     }
//   };

//   const filteredProducts = data?.data?.filter((ad: AdProduct) => {
//     const matchesSearch = ad.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ad.requested_by.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === "all" || ad.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   }) || [];

//   if (isLoading) {
//     return (
//       <div className="h-full w-full flex flex-col justify-start items-baseline p-12 gap-6">
//         <div className="w-full grid grid-cols-2">
//           <div className="flex gap-4">
//             <Skeleton className="h-10 w-[200px]" />
//             <Skeleton className="h-10 w-[100px]" />
//           </div>
//           <div className="flex flex-row justify-end items-center">
//             <Skeleton className="h-10 w-[180px]" />
//           </div>
//         </div>
//         <Skeleton className="h-8 w-[300px]" />
//         {Array.from({ length: 8 }).map((_, i) => (
//           <div key={i} className="w-full rounded-2xl flex flex-row justify-between items-center border p-4 gap-4">
//             <Skeleton className="size-16 rounded-lg" />
//             <Skeleton className="h-4 flex-1" />
//             <Skeleton className="h-4 w-[100px]" />
//             <Skeleton className="h-10 w-[100px]" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="h-full w-full flex items-center justify-center p-12">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-500">Error loading ad products</h2>
//           <p className="text-muted-foreground">Please try again later</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full w-full flex flex-col justify-start items-baseline p-12 gap-6">
//       <div className="w-full grid grid-cols-2">
//         <div className="flex gap-4">
//           <Input
//             placeholder="Search by product or requester"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
//           />
//           <Button onClick={handleSearch}>Search</Button>
//         </div>
//         <div className="flex flex-row justify-end items-center">
//           <Select value={filterStatus} onValueChange={setFilterStatus}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Statuses</SelectItem>
//               <SelectItem value="approved">Approved</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="rejected">Rejected</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <h2 className="text-2xl font-bold">Sponsored Product Ads</h2>

//       {filteredProducts.length > 0 ? (
//         <>
//           <div className="w-full space-y-4">
//             {filteredProducts.map((ad: AdProduct) => (
//               <div
//                 className="w-full rounded-2xl flex flex-row justify-between items-center border p-4 gap-4"
//                 key={ad.id}
//               >
//                 <div
//                   className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
//                   style={{
//                     backgroundImage: `url('${ad.product_image || '/placeholder-product.jpg'}')`,
//                     backgroundSize: 'contain'
//                   }}
//                 ></div>
//                 <div className="font-semibold flex-1 min-w-0">
//                   <div className="truncate">{ad.product_name}</div>
//                   <div className="text-sm text-muted-foreground truncate">
//                     Requested by: {ad.requested_by}
//                   </div>
//                 </div>
//                 <div className="flex flex-col items-center min-w-[100px]">
//                   <div className="text-sm font-semibold">
//                     ${parseFloat(ad.amount).toFixed(2)}
//                   </div>
//                   <Badge
//                     variant={
//                       ad.status === 'approved' ? 'default' :
//                         ad.status === 'rejected' ? 'destructive' : 'secondary'
//                     }
//                     className="capitalize"
//                   >
//                     {ad.status}
//                   </Badge>
//                 </div>
//                 <div className="text-sm font-semibold min-w-[150px]">
//                   {ad.end_date ? (
//                     <>
//                       <div>Expires: {format(new Date(ad.end_date), 'MMM dd, yyyy')}</div>
//                       {ad.remaining_days !== null && (
//                         <div className="text-xs text-muted-foreground">
//                           ({ad.remaining_days} days left)
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     'No expiry date'
//                   )}
//                 </div>
//                 {
//                   <div className="flex flex-row justify-end items-center gap-2 min-w-[100px]">



//                     <Button
//                       onClick={() => handleReject(JSON.stringify(ad.id))}
//                       variant="outline"
//                       className="w-[100px]"
//                     >
//                       Reject
//                     </Button>

//                     <Button
//                       onClick={() => handleStatusChange(JSON.stringify(ad.id))}
//                       variant="outline"
//                       className="w-[100px]"
//                     >
//                       Approve
//                     </Button>

//                     <Button
//                       onClick={() => handleViewDetails(JSON.stringify(ad.id))}
//                       variant="outline"
//                       className="w-[100px]"
//                     >
//                       ViewDetails
//                     </Button>


//                   </div>
//                 }

//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="w-full flex justify-center mt-4">
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     onClick={() => handlePageChange(page - 1)}
//                   />
//                 </PaginationItem>
//                 <span className="mx-4 text-sm">
//                   Page {page} of {data?.meta?.last_page || 1}
//                 </span>
//                 <PaginationItem>
//                   <PaginationNext
//                     onClick={() => handlePageChange(page + 1)}

//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         </>
//       ) : (
//         <div className="w-full text-center py-8 text-muted-foreground">
//           No ad products found matching your criteria
//         </div>
//       )}
//     </div>
//   );
// }





'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApproveAddMutation, useGetallAddRequestQuery } from "@/redux/features/admin/AdminApis";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

// Interface for the Ad Product data structure
interface AdProduct {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  user_id: number;
  requested_by: string;
  requested_at: string;
  amount: string;
  approved_by: string | null;
  rejected_by: string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  display_order: number;
  status: "approved" | "pending" | "rejected";
  preferred_duration: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  remaining_days: number | null;
  created_at: string;
  updated_at: string;
}

// Modal component to view ad details
const ViewDetailsModal = ({ ad, isOpen, onClose }: { ad: AdProduct; isOpen: boolean; onClose: () => void; }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ad Request Details</DialogTitle>
          <DialogDescription>
            Review the details of the ad request below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <img
              src={ad.product_image || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=Image'}
              alt={ad.product_name}
              className="size-24 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{ad.product_name}</h3>
              <p className="text-sm text-muted-foreground">Product ID: {ad.product_id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant={
                  ad.status === 'approved' ? 'default' :
                    ad.status === 'rejected' ? 'destructive' : 'secondary'
                }
                className="capitalize"
              >
                {ad.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="font-semibold">${parseFloat(ad.amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Requested By</p>
              <p>{ad.requested_by}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Requested At</p>
              <p>{format(new Date(ad.requested_at), 'MMM dd, yyyy, p')}</p>
            </div>
            {ad.start_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p>{format(new Date(ad.start_date), 'MMM dd, yyyy')}</p>
              </div>
            )}
            {ad.end_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                <p>{format(new Date(ad.end_date), 'MMM dd, yyyy')}</p>
              </div>
            )}
            {ad.remaining_days !== null && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining Days</p>
                <p>{ad.remaining_days}</p>
              </div>
            )}
            {ad.approved_by && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                <p>{ad.approved_by}</p>
              </div>
            )}
            {ad.approved_at && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved At</p>
                <p>{format(new Date(ad.approved_at), 'MMM dd, yyyy, p')}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function AdProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAd, setSelectedAd] = useState<AdProduct | null>(null);
  const per_page = 8;

  const { data, isLoading, isError, refetch } = useGetallAddRequestQuery({
    page,
    per_page,
    type: "products",
  });
  const [approveAdd, { isLoading: isApproving }] = useApproveAddMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch(); // Refetch data on search
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await approveAdd({ id, status, type: "products", is_active: status === 'approved' ? '1' : '0' }).unwrap();
      if (response?.ok) {
        toast.success(`Ad request has been ${status}.`);
        refetch();
      } else {
        toast.error(response?.message || `Failed to ${status} ad request.`);
      }
    } catch (error: any) {
      console.error('error', error);
      toast.error(error?.data?.message || `Failed to change status.`);
    }
  };

  const handleViewDetails = (ad: AdProduct) => {
    setSelectedAd(ad);
  };

  const handleCloseModal = () => {
    setSelectedAd(null);
  }

  const handlePageChange = (newPage: number) => {
    const lastPage = data?.meta?.last_page || 1;
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  const filteredProducts = data?.data?.filter((ad: AdProduct) => {
    const matchesSearch = ad.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.requested_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ad.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];
  console.log('filteredProducts', filteredProducts);

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col justify-start items-baseline p-4 sm:p-12 gap-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-full md:w-[250px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <div className="flex flex-row justify-start md:justify-end items-center">
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        <Skeleton className="h-8 w-[300px]" />
        <div className="w-full space-y-4">
          {Array.from({ length: per_page }).map((_, i) => (
            <div key={i} className="w-full rounded-2xl flex items-center border p-4 gap-4">
              <Skeleton className="size-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-[100px] hidden sm:block" />
              <Skeleton className="h-10 w-[150px] hidden md:block" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full flex items-center justify-center p-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error loading ad products</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-start items-baseline p-4 md:p-12 gap-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            placeholder="Search by product or requester"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
        <div className="flex flex-row justify-start md:justify-end items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="text-2xl font-bold">Sponsored Product Ads</h2>

      {filteredProducts.length > 0 ? (
        <>
          <div className="w-full space-y-4">
            {filteredProducts.map((ad: AdProduct) => (
              <div
                className="w-full rounded-2xl flex flex-row items-center border p-4 gap-4"
                key={ad.id}
              >
                <img
                  className="size-16 aspect-square bg-secondary rounded-lg object-cover flex-shrink-0"
                  src={ad.product_image || 'https://placehold.co/64x64/e2e8f0/e2e8f0?text=Image'}
                  alt={ad.product_name}
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/64x64/e2e8f0/e2e8f0?text=Error'; }}
                />
                <div className="font-semibold flex-1 max-w-sm  mx-auto">
                  <div className="truncate" title={ad.product_name}>{ad.product_name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    Requested by: {ad.requested_by}
                  </div>
                </div>
                <div className="flex-col items-center min-w-[100px] hidden sm:flex">
                  <div className="text-sm font-semibold">
                    ${parseFloat(ad.amount).toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      ad.status === 'approved' ? 'default' :
                        ad.status === 'rejected' ? 'destructive' : 'secondary'
                    }
                    className="capitalize"
                  >
                    {ad.status}
                  </Badge>
                </div>
                <div className="text-sm font-semibold min-w-[150px] hidden md:block">
                  {ad.end_date ? (
                    <>
                      <div>Expires: {format(new Date(ad.end_date), 'MMM dd, yyyy')}</div>
                      {ad.remaining_days !== null && ad.remaining_days >= 0 && (
                        <div className="text-xs text-muted-foreground">
                          ({ad.remaining_days} days left)
                        </div>
                      )}
                    </>
                  ) : (
                    'No expiry date'
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDetails(ad)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(String(ad.id), 'approved')}
                        disabled={isApproving}
                      >
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleStatusChange(String(ad.id), 'rejected')}
                        disabled={isApproving}
                      >
                        Reject
                      </DropdownMenuItem>
                    </>

                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            ))}
          </div>

          {/* Pagination */}
          {data?.meta?.last_page > 1 && (
            <div className="w-full flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      aria-disabled={page === 1}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  <span className="mx-4 text-sm">
                    Page {page} of {data?.meta?.last_page || 1}
                  </span>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      aria-disabled={page === data?.meta?.last_page}
                      className={page === data?.meta?.last_page ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="w-full text-center py-8 text-muted-foreground">
          No ad products found matching your criteria.
        </div>
      )}

      {/* Modal Render */}
      {selectedAd && (
        <ViewDetailsModal
          ad={selectedAd}
          isOpen={!!selectedAd}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
