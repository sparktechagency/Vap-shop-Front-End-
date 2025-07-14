"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import Namer from "./internal/namer";
import Link from "next/link";
import {
  useDeleteInboxMutation,
  useSendInboxMutation,
} from "@/redux/features/users/userApi";
import { useState } from "react";
import { toast } from "sonner";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
interface Sender {
  first_name: string;
  role_label: string;
  avatar: string;
  role?: number;
  id: string;
}
export default function InboxCard({
  data,
  refetch,
}: {
  refetch: () => void;
  data: {
    receiver: {
      first_name: string;
      role_label: string;
      avatar: string;
      role?: number;
      id: string;
    };
    replies: {
      id: number;
      sender_id: number;
      receiver_id: number;
      message: string;
      parent_id: number | null;
      created_at: string;
      updated_at: string;
      sender: Sender;
    }[];
    sender: Sender;
    message: string;
    id: number;
  };
}) {
  // console.log(data);
  const [sendInbox] = useSendInboxMutation();
  const [message, setMessage] = useState("");
  const [deleteInbox] = useDeleteInboxMutation();
  const { data: me, isLoading } = useGetOwnprofileQuery();

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-3 font-semibold text-base">
          <Avatar className="size-10">
            <AvatarImage src={data.sender.avatar} className="object-cover" />
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          <Link
            href={
              data?.sender.role === 5
                ? `/stores/store/${data?.sender.id}`
                : data?.sender.role === 3
                ? `/brands/brand/${data?.sender.id}`
                : `/profile/${data?.sender.id}`
            }
          >
            <Namer
              name={data.sender.first_name}
              size="md"
              isVerified={false}
              type={
                data.sender.role
                  ? data.sender.role_label.toLowerCase()
                  : "member"
              }
            />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="!p-4 text-sm text-muted-foreground">{data.message}</div>

      {/* Footer */}
      <div className="border-t !p-2 flex flex-row justify-between items-center bg-secondary">
        <div className="!space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <MessageCircle /> Reply
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Reply to {data.receiver.first_name}</DialogTitle>
              <DialogDescription>{data.message}</DialogDescription>
              <div className="w-full border-t space-y-6 py-6 divide-y max-h-[70dvh] overflow-x-auto">
                {data.replies.map((x, i) => (
                  <div key={i} className="pb-6">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={x.sender.avatar} />
                      </Avatar>
                      <Link
                        href={
                          x?.sender.role === 5
                            ? `/stores/store/${x?.sender.id}`
                            : data?.sender.role === 3
                            ? `/brands/brand/${x?.sender.id}`
                            : `/profile/${x?.sender.id}`
                        }
                      >
                        <Namer
                          name={x.sender.first_name}
                          size="sm"
                          isVerified={false}
                          type={
                            x.sender.role
                              ? x.sender.role_label.toLowerCase()
                              : "member"
                          }
                        />
                      </Link>
                    </div>
                    <div className="pt-2 text-xs">{x.message}</div>
                  </div>
                ))}
              </div>
              <DialogFooter className="border-t !py-4">
                <div className="w-full flex flex-row gap-3">
                  <Input
                    placeholder="Type here.."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <Button
                    variant="special"
                    onClick={async () => {
                      const finalizer = {
                        receiver_id: data.receiver.id,
                        message,
                        parent_id: data.id,
                      };
                      console.log(finalizer);
                      try {
                        const res = await sendInbox(finalizer).unwrap();
                        if (!res.ok) {
                          toast.error(res.message);
                        } else {
                          toast.success(res.message);
                          refetch();
                          setMessage("");
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    Send
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {!isLoading &&
            [String(data.sender.id), String(data.receiver.id)].includes(
              String(me.data.id)
            ) && (
              <Button
                variant="ghost"
                className="text-destructive"
                onClick={async () => {
                  try {
                    const res = await deleteInbox({ id: data.id }).unwrap();
                    if (!res.ok) {
                      toast.error(res.message);
                    } else {
                      toast.success(res.message);
                      refetch();
                      setMessage("");
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <Trash2Icon />
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
