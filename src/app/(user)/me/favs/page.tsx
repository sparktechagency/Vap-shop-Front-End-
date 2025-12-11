import React, { Suspense } from "react";
import FavList from "./fav-list";
import { Loader2Icon } from "lucide-react";

export default async function Page() {
  return (
    <section>
      <h1 className="text-center font-semibold text-2xl pb-2 border-b">
        My Favorite Products
      </h1>
      <Suspense
        fallback={
          <div className="h-12 w-full flex justify-center items-center">
            <Loader2Icon className="animate-spin" />
          </div>
        }
      >
        <FavList />
      </Suspense>
    </section>
  );
}
