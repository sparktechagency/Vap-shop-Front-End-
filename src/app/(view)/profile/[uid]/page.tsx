"use client";
import { useSearchParams } from "next/navigation";
import TabsTriggerer from "./tabs-trigger";

export default function Page() {
  const searched = useSearchParams();

  return (
    <main className="">
      <TabsTriggerer />
    </main>
  );
}
