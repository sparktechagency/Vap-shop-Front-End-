"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Editor } from "primereact/editor";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
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
          <Label htmlFor="image" className="mb-2 block text-sm font-medium">
            Article Image:
          </Label>

          <label
            htmlFor="image"
            className="cursor-pointer py-12! flex flex-col justify-center items-center w-full border-2 border-dashed rounded-lg hover:border-muted transition-colors space-y-6! hover:bg-secondary"
          >
            <UploadCloud className="w-8 h-8 text-muted-foreground mb-2!" />
            <h4 className="text-base font-medium">Select an image</h4>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, or GIF up to 5mb
            </p>
          </label>

          <Input type="file" id="image" className="hidden" />

          <Label>Article Description:</Label>
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
