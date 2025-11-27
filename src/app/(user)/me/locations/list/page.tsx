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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useConnectReuqestApiMutation,
  useConnectReuqestListApiQuery,
  useRespondConnectApiMutation,
} from "@/redux/features/Home/HomePageApi";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ReqType {
  id: number;
  first_name: string;
  last_name: string;
  dob: any;
  email: string;
  role: number;
  avatar: string;
  cover_photo: string;
  phone: string;
  suspended_at: any;
  suspended_until: any;
  suspend_reason: any;
  banned_at: any;
  ban_reason: any;
  ein: string;
  pl: number;
  open_from: any;
  close_at: any;
  created_at: string;
  updated_at: string;
  role_label: string;
  full_name: string;
  total_followers: number;
  total_following: number;
  is_following: boolean;
  avg_rating: number;
  total_reviews: number;
  is_favourite: boolean;
  is_banned: boolean;
  is_suspended: boolean;
  unread_conversations_count: number;
  is_subscribed: boolean;
  unread_notifications: number;
  subscription_data: Array<any>;
  pivot: {
    connected_store_id: number;
    store_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  metric_adjustments: Array<any>;
}

export default function Page() {
  const { data, isLoading } = useConnectReuqestListApiQuery();
  const [updateStatus] = useRespondConnectApiMutation();
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-24 mx-auto`}>
        <Loader2Icon className={`animate-spin`} />
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Store Name</TableHead>
          <TableHead>Store Followers</TableHead>
          <TableHead>Store Followings</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.map((x: ReqType) => (
          <TableRow>
            <TableCell>{x.full_name}</TableCell>
            <TableCell>{x.total_followers}</TableCell>
            <TableCell>{x.total_following}</TableCell>
            <TableCell className="space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"special"}>
                    <CheckIcon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Accept request?</AlertDialogTitle>
                    <AlertDialogDescription>
                      After you accept accept this request. both stores will
                      share connected location data
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          const res: any = await updateStatus({
                            id: x.id,
                            status: "accepted",
                          });

                          if (!res.ok) {
                            toast.error(
                              res.data.message ??
                                "Failed to Accept this request"
                            );
                          } else {
                            toast.success(
                              res.data.message ??
                                "Accepted this request successfully"
                            );
                          }
                        } catch (error) {
                          console.error("Failed to accept this request");
                        }
                      }}
                    >
                      Accept
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"}>
                    <XIcon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to reject this connection request
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive!"
                      onClick={async () => {
                        try {
                          const res: any = await updateStatus({
                            id: x.id,
                            status: "rejected",
                          });

                          if (!res.ok) {
                            toast.error(
                              res.message ?? "Failed to Accept this request"
                            );
                          } else {
                            toast.success(
                              res.message ??
                                "Accepted this request successfully"
                            );
                          }
                        } catch (error) {
                          console.error("Failed to accept this request");
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
  );
}
