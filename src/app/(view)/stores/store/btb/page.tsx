import React from "react";
import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPinIcon } from "lucide-react";
import Dotter from "@/components/ui/dotter";
import Catalog from "../catalog";
export default function Page() {
  return (
    <>
      {" "}
      <div
        className="h-[50dvh] w-full relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/image/home/car2.png')` }}
      >
        <Avatar className="size-40 absolute -bottom-[10rem] -translate-y-1/2 -translate-x-1/2 md:translate-x-0 left-1/2 lg:left-[7%]">
          <AvatarImage src="/image/icon/store.png" />
          <AvatarFallback>VD</AvatarFallback>
        </Avatar>
      </div>
      <main className="!py-12 !p-4 lg:!px-[7%]">
        <div className="!pb-12">
          <div className="h-12"></div>
          <div className="flex !py-4 gap-4 items-center">
            <div className="lg:h-24 flex flex-col !py-3 justify-between">
              <Namer
                name="Vape Juice Deport"
                isVerified
                type="brand"
                size="xl"
              />
            </div>
          </div>
          <div className="">
            <p className="text-xs md:text-sm xl:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="!mt-8 flex flex-col gap-4 lg:flex-row justify-between items-center">
            <div className="text-xs md:text-sm text-muted-foreground flex gap-2 items-center">
              <span className={"text-green-600"}>Open Now</span>
              <Dotter />
              <span>Close 10 PM</span>
            </div>
            <div className="text-xs flex items-center gap-2">
              <MapPinIcon className="size-4" />
              BROOKLYN, New York
            </div>
          </div>
        </div>
        <div className="!py-12 border-t">
          <h2 className="text-lg sm:text-xl md:text-3xl font-semibold">
            Available for wholesale
          </h2>
          <Catalog />
        </div>
      </main>
    </>
  );
}
