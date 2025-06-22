import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function Page() {
  return (
    <section className="space-y-6! mt-6!">
      <h1 className="text-3xl font-bold">Create a new feed</h1>
      <div className="space-y-6!">
        <Textarea className="h-[30dvh]!" /> <Button>Post a Feed</Button>
      </div>
    </section>
  );
}
