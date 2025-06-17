"use client";
import { useSearchParams } from "next/navigation";
import TabsTriggerer from "./tabs-trigger";

export default function Page() {
  const searched = useSearchParams();

  console.log(searched.get("type"));

  return (
    <main className="">
      <TabsTriggerer />
    </main>
  );
}
