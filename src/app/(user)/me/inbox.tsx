"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import InboxCard from "@/components/core/inbox-card";

import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { useGetInboxQuery } from "@/redux/features/users/userApi";
import React from "react";

export default function Inbox() {
  const { data: me } = useGetOwnprofileQuery();
  const { id } = me?.data;
  const { data, isLoading, refetch } = useGetInboxQuery({ id });
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
