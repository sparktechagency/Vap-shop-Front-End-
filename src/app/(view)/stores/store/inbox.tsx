"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import InboxCard from "@/components/core/inbox-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import {
  useGetInboxQuery,
  useSendInboxMutation,
} from "@/redux/features/users/userApi";
import { SendIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Inbox({ storeId }: { storeId: any }) {
  const [message, setMessage] = useState("");
  const [sendInbox] = useSendInboxMutation();
  const { data: me } = useGetOwnprofileQuery();
  const { id } = me?.data;
  const { data, isLoading, refetch } = useGetInboxQuery({ id });

  return (
    <div className="!p-6">
      {isLoading ? (
        <div className="h-12 w-full flex justify-center items-center">
          Loading..
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Write a message</Button>
              </DialogTrigger>
              <DialogContent className="min-w-[80dvw]">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="">
                  <Textarea
                    placeholder="Type your message here.."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={async () => {
                      const finalizer = {
                        receiver_id: storeId,
                        message,
                        // parent_id:storeId
                      };
                      try {
                        const res = await sendInbox(finalizer).unwrap();
                        if (!res.ok) {
                          toast.error(res.message);
                        } else {
                          toast.success(res.message);
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    <SendIcon /> Send Message
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="!my-12 !space-y-6">
            {data?.data?.data?.map((x: any, i: number) => (
              <InboxCard key={i} data={x} refetch={refetch} />
            ))}
            {data.data.length <= 0 && (
              <p className="text-center flex justify-center items-center">
                No messages to show
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
