'use client';
import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  InfoIcon,
  Loader2Icon,
  MapPinIcon,
  MessageSquareMoreIcon,
  RadioIcon,
  Share2Icon,
} from "lucide-react";
import React from "react";
import TabsTriggerer from "../tabs-trigger";
import Dotter from "@/components/ui/dotter";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetOwnprofileQuery, useGtStoreDetailsQuery } from "@/redux/features/AuthApi";
import { useGetStoreDetailsByIdQuery } from "@/redux/features/store/StoreApi";

export default function Page() {
  const { id } = useParams();
  console.log('id', id);
  const { data, isLoading } = useGtStoreDetailsQuery({ id: id as any });

  const { data: brandDetails, isLoading: isBrandLoading, refetch } = useGetStoreDetailsByIdQuery(id as any);
  console.log('brand details', brandDetails);
  if (isLoading) {
    return (
      <div className="!p-6 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div
        className="h-[50dvh] w-full relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${data?.data?.cover_photo || '/image/home/car2.png'}')` }}
      >
        <Avatar className="size-40 absolute -bottom-[10rem] -translate-y-1/2 -translate-x-1/2 md:translate-x-0 left-1/2 lg:left-[7%]">
          <AvatarImage src={data?.data?.avatar || '/image/icon/store.png'} />
          <AvatarFallback>VD</AvatarFallback>
        </Avatar>
      </div>
      <main className="!py-12 !p-4 lg:!px-[7%]">
        <div className="">
          <div className="h-12"></div>
          <div className="flex !py-4 gap-4 items-center">
            <div className="lg:h-24 flex flex-col !py-3 justify-between">
              <Namer
                name={data?.data?.full_name || "Vape Juice Deport"}
                isVerified
                type="store"
                size="xl"
              />
            </div>
          </div>
          {/* <div className="hidden">
            <p className="text-xs md:text-sm xl:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div> */}
          <div className="!mt-2 flex flex-col gap-4 lg:flex-row justify-between items-center">
            <div className="text-xs md:text-sm text-muted-foreground flex gap-2 items-center">
              <span className={"text-green-600"}>Open Now</span>
              <Dotter />
              <span>Close 10 PM</span>
            </div>
            <div className="text-xs flex items-center gap-2">
              <MapPinIcon className="size-4" />
              <span>{data?.data?.address || "No Address"}</span>
            </div>
          </div>
          <div className="!mt-4">
            <div className="grid grid-cols-1 md:flex gap-8 items-center">
              <div className="text-xs flex items-center gap-2 cursor-pointer hover:text-foreground/80">
                <InfoIcon className="size-4" />
                About us
              </div>
              <div className="text-xs cursor-pointer hover:text-foreground/80">
                <Link
                  href="/stores/store/connected-stores"
                  className="flex items-center gap-2 "
                >
                  <RadioIcon className="size-4" />
                  Connected Stores
                </Link>
              </div>
              <div className="text-xs flex items-center gap-1">
                PL
                <CheckCircle2Icon className="size-4 text-green-600" />
              </div>
              <div className="flex-1 md:h-24 grid grid-cols-1 md:flex flex-row justify-end items-center gap-4">
                <p className="font-semibold text-sm">43.1k followers</p>
                <Button
                  variant="outline"
                  className="!text-sm font-extrabold"
                  asChild
                >
                  <Link href="/stores/store/btb"> B2B</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-9"
                  size="icon"
                  asChild
                >
                  <Link href="/chat">
                    <MessageSquareMoreIcon />
                  </Link>
                </Button>
                <Button>Follow</Button>
                <Button variant="outline" className="w-full md:w-9" size="icon">
                  <Share2Icon />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <TabsTriggerer />
        </div>
      </main>
    </>
  );
}
