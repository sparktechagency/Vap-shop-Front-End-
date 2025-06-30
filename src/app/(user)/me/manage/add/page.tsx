"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/custom-tabs";
import React from "react";
import Manual from "./manual";
import { useUser } from "@/context/userContext";
// import Import from "./import";

export default function Page() {
  const { role } = useUser();
  return (
    <div className="!py-12">
      <h2 className="mb-6! font-semibold text-3xl text-center">
        Add product to your catalog
      </h2>
      <Tabs defaultValue={role === "5" ? "import" : "manual"}>
        <TabsList className="border-b">
          {/* <TabsTrigger value="import">Brand Import</TabsTrigger> */}
          <TabsTrigger value="manual">Add Manually</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="import">
          <Import />
        </TabsContent> */}
        <TabsContent value="manual">
          <Manual />
        </TabsContent>
      </Tabs>
    </div>
  );
}
