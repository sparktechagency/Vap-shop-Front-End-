"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import InboxCard from "@/components/core/inbox-card";
import { useUser } from "@/context/userContext";

// import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { useGetInboxQuery } from "@/redux/features/users/userApi";
import { Construction, InboxIcon } from "lucide-react";
import React from "react";

export default function Page() {
  // const { data: me } = useGetOwnprofileQuery();
  const { id } = useUser();
  const { data, isLoading } = useGetInboxQuery({ id });
  if (!isLoading) {
    console.log(data);
  }

  return (
    <div className="!p-6">
      {isLoading ? (
        <div className="h-12 w-full flex justify-center items-center">
          Loading..
        </div>
      ) : (
        <>
          <div className="!my-12 !space-y-6 flex items-center justify-center">
            {/* {data?.data?.data?.map((x: any, i: number) => (
              <InboxCard key={i} data={x} refetch={refetch} />
            ))}
            {data.data.length <= 0 && (
              <div className="flex items-center justify-center flex-col text-muted-foreground">
                <InboxIcon className="size-12" />
                <p>Empty Inbox</p>
              </div>
            )} */}
            <p className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Construction className="size-6" /> Under Development
            </p>
          </div>
        </>
      )}
    </div>
  );
}
