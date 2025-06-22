import { Button } from "@/components/ui/button";
import { Editor } from "primereact/editor";
import React from "react";

export default function About() {
  return (
    <section className="space-y-6! pt-4!">
      <h1 className="text-3xl font-semibold">About Us</h1>
      <Editor style={{ height: "50dvh" }} />
      <Button>Update About Us</Button>
    </section>
  );
}
