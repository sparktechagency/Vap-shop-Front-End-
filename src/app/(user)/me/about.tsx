import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { Editor } from "primereact/editor";
import React from "react";

export default function About() {
  const my = useUser();
  console.log(my);
  return (
    <section className="space-y-6! pt-4!">
      <h1 className="text-3xl font-semibold">About Us</h1>
      <Editor style={{ height: "50dvh" }} />
      <Button>Update About Us</Button>
    </section>
  );
}
