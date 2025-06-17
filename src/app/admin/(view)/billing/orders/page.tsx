import React from "react";
import OrdersTable from "../orders_table";

export default function Page() {
  return (
    <div className="h-full w-full border rounded-xl !p-6">
      <div className="">
        <h1>Orders and Payment Dataset</h1>
        <div className="!p-6">
          <OrdersTable />
        </div>
      </div>
    </div>
  );
}
