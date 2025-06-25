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
import { useApproveAddMutation, useGetallAddRequestQuery } from "@/redux/features/admin/AdminApis";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";

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

export default function AdProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
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
  };


  const handleStatusChange = async (id: string) => {
    try {
      const response = await approveAdd({ id, status: "approved", type: "products", is_active: '1' }).unwrap();
      console.log('response', response);
      if (response?.ok) {
        toast.success('Status changed successfully');
        refetch();
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to change status');
    }
  };
  const handleReject = async (id: string) => {
    try {
      const response = await approveAdd({ id, status: "rejected", type: "products", is_active: '0' }).unwrap();
      console.log('response', response);
      if (response?.ok) {
        toast.success('Status changed successfully');
        refetch();
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to change status');
    }
  };

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

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col justify-start items-baseline p-12 gap-6">
        <div className="w-full grid grid-cols-2">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <div className="flex flex-row justify-end items-center">
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        <Skeleton className="h-8 w-[300px]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-full rounded-2xl flex flex-row justify-between items-center border p-4 gap-4">
            <Skeleton className="size-16 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        ))}
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
    <div className="h-full w-full flex flex-col justify-start items-baseline p-12 gap-6">
      <div className="w-full grid grid-cols-2">
        <div className="flex gap-4">
          <Input
            placeholder="Search by product or requester"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
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
                className="w-full rounded-2xl flex flex-row justify-between items-center border p-4 gap-4"
                key={ad.id}
              >
                <div
                  className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
                  style={{
                    backgroundImage: `url('${ad.product_image || '/placeholder-product.jpg'}')`,
                    backgroundSize: 'contain'
                  }}
                ></div>
                <div className="font-semibold flex-1 min-w-0">
                  <div className="truncate">{ad.product_name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    Requested by: {ad.requested_by}
                  </div>
                </div>
                <div className="flex flex-col items-center min-w-[100px]">
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
                <div className="text-sm font-semibold min-w-[150px]">
                  {ad.end_date ? (
                    <>
                      <div>Expires: {format(new Date(ad.end_date), 'MMM dd, yyyy')}</div>
                      {ad.remaining_days !== null && (
                        <div className="text-xs text-muted-foreground">
                          ({ad.remaining_days} days left)
                        </div>
                      )}
                    </>
                  ) : (
                    'No expiry date'
                  )}
                </div>
                {
                  ad.status == 'approved' ? (
                    <Button
                      onClick={() => handleReject(JSON.stringify(ad.id))}
                      variant="outline"
                      className="w-[100px]"
                    >
                      Reject
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStatusChange(JSON.stringify(ad.id))}
                      variant="outline"
                      className="w-[100px]"
                    >
                      Approve
                    </Button>
                  )
                }

              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="w-full flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                  />
                </PaginationItem>
                <span className="mx-4 text-sm">
                  Page {page} of {data?.meta?.last_page || 1}
                </span>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}

                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <div className="w-full text-center py-8 text-muted-foreground">
          No ad products found matching your criteria
        </div>
      )}
    </div>
  );
}