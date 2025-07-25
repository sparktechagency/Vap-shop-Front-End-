import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <section className="mt-12 border-t pt-6">
      <div className="w-full flex justify-end items-center">
        <Button asChild>
          <Link href={"/me/manage/b2b/add"}>Add Wholesale Product</Link>
        </Button>
      </div>
      <div className="mt-6">Products</div>
    </section>
  );
}
