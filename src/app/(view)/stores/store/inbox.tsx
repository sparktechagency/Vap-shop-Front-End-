import InboxCard from "@/components/core/inbox-card";
import React from "react";

export default function Inbox() {
  const data = {
    name: "Irene Adler",
    avatar: "",
    role: "member",
  };

  return (
    <div className="!my-12 !space-y-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <InboxCard data={data} key={i} />
      ))}
    </div>
  );
}
