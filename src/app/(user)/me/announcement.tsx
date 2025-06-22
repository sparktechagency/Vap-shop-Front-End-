import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function About() {
  return (
    <section className="space-y-6! pt-4!">
      <h1 className="text-3xl font-semibold">Post an announcement</h1>
      <Textarea style={{ height: "20dvh" }} />
      <Button>Post announcement</Button>
    </section>
  );
}
