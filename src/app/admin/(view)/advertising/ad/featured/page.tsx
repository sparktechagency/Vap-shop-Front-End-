"use client";

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
  useApproveAddMutation,
  useGetallAddRequestQuery,
} from "@/redux/features/admin/AdminApis";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

interface AdProduct {
  id: number;
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

  const { data, isLoading, refetch } = useGetallAddRequestQuery({
    page,
    per_page,
    type: "featured",
  });

  const [approveAdd, { isLoading: isApproving }] = useApproveAddMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleStatusChange = async (id: string) => {
    try {
      const response = await approveAdd({
        id,
        status: "approved",
        type: "featured",
        is_active: "1",
      }).unwrap();

      if (response?.ok) {
        toast.success("Ad approved successfully");
        refetch();
      } else {
        toast.error(response?.message || "Failed to approve ad");
      }
    } catch (error) {
      console.error("Error approving ad:", error);
      toast.error("Failed to approve ad");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await approveAdd({
        id,
        status: "rejected",
        type: "followers",
        is_active: "0",
      }).unwrap();

      if (response?.ok) {
        toast.success("Ad rejected successfully");
        refetch();
      } else {
        toast.error(response?.message || "Failed to reject ad");
      }
    } catch (error) {
      console.error("Error rejecting ad:", error);
      toast.error("Failed to reject ad");
    }
  };

  const handlePageChange = (newPage: number) => {
    const lastPage = data?.meta?.last_page || 1;
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  const filteredProducts =
    data?.data?.filter((ad: AdProduct) => {
      const matchesSearch = ad.requested_by
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || ad.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col justify-start items-baseline !p-12 gap-6">
        <div className="w-full grid grid-cols-2">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <div className="flex flex-row justify-end items-center">
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Most Featured Ads</h2>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
            key={i}
          >
            <div
              className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
              // style={{ backgroundImage: `url('/image/home/car1.png')` }}
            ></div>
            <div className="font-semibold">Loading ad...</div>
            <div className="text-sm font-semibold">Date: --/--/----</div>
            <Button disabled>Loading...</Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-start items-baseline !p-12 gap-6">
      <div className="w-full grid grid-cols-2">
        <div className="flex gap-4">
          <Input
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="text-2xl font-bold">Most Followers Ads</h2>

      {filteredProducts.length > 0 ? (
        <>
          {filteredProducts.map((ad: AdProduct) => (
            <div
              className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
              key={ad.id}
            >
              <div
                className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
                style={{ backgroundImage: `url('/image/home/car1.png')` }}
              ></div>
              <div className="font-semibold">
                {ad.requested_by}&apos;s Follower Ad
              </div>
              <div className="text-sm font-semibold">
                {ad.end_date
                  ? `Expires: ${format(new Date(ad.end_date), "MM-dd-yyyy")}`
                  : "No expiry date"}
                {ad.remaining_days && (
                  <div className="text-xs text-muted-foreground">
                    ({ad.remaining_days} days left)
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center min-w-[100px]">
                <div className="text-sm font-semibold">
                  ${parseFloat(ad.amount).toFixed(2)}
                </div>
                <Badge
                  variant={
                    ad.status === "approved"
                      ? "default"
                      : ad.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {ad.status}
                </Badge>
              </div>
              {ad.status === "approved" ? (
                <Button
                  variant="outline"
                  onClick={() => handleReject(JSON.stringify(ad?.id))}
                  disabled={isApproving}
                >
                  Reject
                </Button>
              ) : (
                <Button
                  variant="special"
                  onClick={() => handleStatusChange(JSON.stringify(ad?.id))}
                  disabled={isApproving}
                >
                  Approve
                </Button>
              )}
            </div>
          ))}

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
                  <PaginationNext onClick={() => handlePageChange(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <div className="w-full text-center py-8 text-muted-foreground">
          No featured ads found matching your criteria
        </div>
      )}
    </div>
  );
}
