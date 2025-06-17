import React from "react";
import TabsTriggererForum from "./tabs-trigger";

export default function Page() {
  return (
    <main className="!py-12 !px-2 md:!px-[7%]">
      <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
        FORUM
      </h1>
      <div className="flex justify-center">
        <TabsTriggererForum />
      </div>
    </main>
  );
}
