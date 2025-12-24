import UserTable from "@/components/UserTable";
import React from "react";

function page() {
  return (
    <div>
      <UserTable role={6} tableCaption="A list of the Members" />
    </div>
  );
}

export default page;
