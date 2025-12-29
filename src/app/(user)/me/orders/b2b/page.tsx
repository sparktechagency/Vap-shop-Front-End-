/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { cn } from "@/lib/utils";
import {
  useBtbStatusUpdateMutation,
  useGetBtbConnectsQuery,
} from "@/redux/features/b2b/btbApi";
import { CheckIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [page, setPage] = useState(1);
  const per = 8;
  const { data, isLoading, isError, error, refetch } =
    useGetBtbConnectsQuery<any>({
      page,
      per,
    });
  const [updateStatus] = useBtbStatusUpdateMutation();

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
                <TableHead>Request date</TableHead>
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
                      <Badge
                        className={cn("capitalize")}
                        variant={
                          x.pivot.status === "rejected"
                            ? "destructive"
                            : "success"
                        }
                      >
                        {x.pivot.status ?? "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* {(
                        <pre className="bg-gradient-to-br max-h-[80dvh] overflow-scroll fixed top-1/2 left-1/2 -translate-1/2 w-[90dvw] z-50 from-zinc-900/60 via-zinc-800/40 to-zinc-900/20 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700/20">
                          <code className="whitespace-pre-wrap">
                            {JSON.stringify(x, null, 2)}
                          </code>
                        </pre>
                      ) ?? "N/A"} */}
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
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={async () => {
                          try {
                            const res: any = await updateStatus({
                              id: x.id,
                              status: "approved",
                            }).unwrap();

                            if (!res.ok) {
                              toast.error(
                                res?.message ?? "Couldn't accept the request"
                              );
                            } else {
                              toast.success(res?.message ?? "Request Accepted");
                            }
                            refetch();
                          } catch (error) {
                            console.error(error);
                            toast.error("Something went wrong");
                          }
                        }}
                      >
                        <CheckIcon />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-destructive"
                            size="icon"
                          >
                            <XIcon />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reject this request?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Once rejected, this request will be removed from
                              the pending list permanently.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={async () => {
                                try {
                                  const res: any = await updateStatus({
                                    id: x.id,
                                    status: "rejected",
                                  }).unwrap();

                                  if (!res.ok) {
                                    toast.error(
                                      res?.message ??
                                        "Couldn't reject the request"
                                    );
                                  } else {
                                    toast.success(
                                      res?.message ?? "Request Rejected"
                                    );
                                  }
                                  refetch();
                                } catch (error) {
                                  console.error(error);
                                  toast.error("Something went wrong");
                                }
                              }}
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
