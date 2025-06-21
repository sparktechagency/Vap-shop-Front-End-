import InboxCard from "@/components/core/inbox-card";
import React from "react";

export default function Inbox() {
  return (
    <div className="!p-6">
      <div className="!my-12 !space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <InboxCard
            key={i}
            data={{
              name: "Irene Adler",
              avatar: "/image/icon/user.jpeg",
              role: undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
