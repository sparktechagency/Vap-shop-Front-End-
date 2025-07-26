import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";
import BtBList from "./btb-list";

export default function Page() {
  return (
    <section className="mt-12 border-t pt-6">
      <h1 className="text-3xl text-center font-semibold pb-4">
        Your B2B Products
      </h1>
      <div>
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <BtBList />
        </Suspense>
      </div>
    </section>
  );
}
