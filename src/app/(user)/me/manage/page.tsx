import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Catalog from "./catalog";
import Link from "next/link";

export default function Page() {
  return (
    <div className="!my-12">
      <h1 className="text-4xl font-semibold !pb-4">Manage Products</h1>
      <Separator />
      <div className="!py-6 flex justify-end">
        <Button asChild>
          <Link href="/me/manage/add">Add New Products</Link>
        </Button>
      </div>
      <Catalog />
    </div>
  );
}
