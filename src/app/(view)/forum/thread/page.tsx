import React from "react";
import Threader from "./threder";
import GoBack from "@/components/core/internal/go-back";

export default function Page() {
  return (
    <main className="!py-12 !px-2 md:!px-[7%]">
      <GoBack />
      <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
        FORUM
      </h1>
      <div className="!my-12">
        <h3 className="text-sm md:text-xl font-semibold">
          The &quot;Vape Help&quot; section of the Vapeshopmaps.com Forum is
          dedicated to providing a supportive and informative space for users
          to:
        </h3>
        <ul className="list-disc list-inside text-xs md:text-sm container !mx-auto !mt-4">
          <li>Ask questions related to vaping.</li>
          <li>Seek advice and guidance from the community.</li>
          <li>
            Receive assistance with technical issues, safety concerns, and other
            vaping-related matters.
          </li>
          <li>Promote responsible vaping practices and harm reduction.</li>
        </ul>
      </div>
      <div className="">
        <Threader />
      </div>
    </main>
  );
}
