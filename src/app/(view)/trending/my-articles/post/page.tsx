"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Editor } from "primereact/editor";
import { Button } from "@/components/ui/button";
export default function Featured() {
  return (
    <>
      <main className="!py-12 !px-2 md:!px-[7%]">
        <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
          Post a new article
        </h1>
        <div className="w-full mt-12! space-y-6!">
          <Label>Article Title:</Label>
          <Input />
          <Label>Article Title:</Label>
          <Editor
            className=""
            style={{ height: "50dvh", borderRadius: "5px" }}
          />
          <Button>Post Article</Button>
        </div>
      </main>
    </>
  );
}
