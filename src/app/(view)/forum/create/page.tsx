import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function Page() {
  return (
    <main className="!py-12 !px-2 md:!px-[7%]">
      <h1 className="text-center font-semibold text-xl md:text-2xl lg:text-4xl mb-12!">
        CREATE A FORUM GROUP
      </h1>
      <div className="space-y-4!">
        <Label>Group name :</Label>
        <Input />
        <Label>Group Description :</Label>
        <Textarea className="h-[30dvh]!" />
        <Button>Create Forum Group</Button>
      </div>
    </main>
  );
}
