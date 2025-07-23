/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBtbConnectsQuery } from "@/redux/features/b2b/btbApi";
import { CheckIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const per = 8;
  const { data, isLoading, isError, error } = useGetBtbConnectsQuery<any>({
    page,
    per,
  });

  const totalPages = data?.data?.last_page ?? 1;

  if (isError) {
    return (
      <section>
        {error?.message ?? error?.data.message ?? "Something went wrong"}
      </section>
    );
  }

  return (
    <section className="p-4">
      <h1 className="text-center mt-12 pb-4 font-bold text-2xl">
        B2B Connection Requests
      </h1>
      <Separator className="mb-6" />

      {data?.data?.data?.length === 0 ? (
        <div className="py-6 flex justify-center items-center font-semibold text-muted-foreground text-sm">
          No Connection Request Found
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Total Followers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                data?.data?.data?.map((x: any, i: number) => (
                  <TableRow key={x.id}>
                    <TableCell>{(page - 1) * per + i + 1}</TableCell>
                    <TableCell>{x.full_name ?? "N/A"}</TableCell>
                    <TableCell>{x.role_label ?? "N/A"}</TableCell>
                    <TableCell>{x.total_followers ?? 0}</TableCell>
                    <TableCell>
                      <Badge className="capitalize">
                        {x.pivot.status ?? "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      {/* Placeholder for actions (buttons, dropdown etc.) */}
                      <Button variant={"outline"} size={"icon"} asChild>
                        <Link
                          href={
                            x.role === 5
                              ? `/stores/store/${x.user_id}`
                              : x.role === 3
                              ? `/brands/brand/${x.user_id}`
                              : `/profile/${x.user_id}`
                          }
                        >
                          <ExternalLinkIcon />
                        </Link>
                      </Button>
                      <Button variant={"outline"} size={"icon"}>
                        <CheckIcon />
                      </Button>
                      <Button variant={"outline"} size={"icon"}>
                        <Trash2Icon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {data?.data?.data?.length !== 0 && (
        <div className="mt-10 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem
                onClick={() => page > 1 && setPage(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              >
                <PaginationPrevious />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i} onClick={() => setPage(i + 1)}>
                  <PaginationLink isActive={i + 1 === page}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem
                onClick={() => page < totalPages && setPage(page + 1)}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              >
                <PaginationNext />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
}
