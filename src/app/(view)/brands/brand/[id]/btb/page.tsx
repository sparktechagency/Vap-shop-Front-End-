/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  CircleOffIcon,
  InfoIcon,
  Loader2Icon,
  MapPinIcon,
  RadioIcon,
} from "lucide-react";
import React from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGtStoreDetailsQuery } from "@/redux/features/AuthApi";

import CartManage from "./cart-manage";

export default function Page() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useGtStoreDetailsQuery({
    id: id as any,
  });

  const navigation = useRouter();

  const handleMapClick = (data: any) => {
    navigation.push(
      `/map?lat=${data?.address?.latitude}&lng=${data?.address?.longitude}`
    );
  };

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
        style={{
          backgroundImage: `url('${
            data?.data?.cover_photo || "/image/home/car2.png"
          }')`,
        }}
      >
        <Avatar className="size-40 absolute -bottom-[10rem] -translate-y-1/2 -translate-x-1/2 md:translate-x-0 left-1/2 lg:left-[7%]">
          <AvatarImage src={data?.data?.avatar || "/image/icon/store.png"} />
          <AvatarFallback>VD</AvatarFallback>
        </Avatar>
      </div>
      <main className="!py-12 !p-4 lg:!px-[7%]">
        <div className="">
          <div className="h-12"></div>
          <div className="flex !py-4 gap-4 items-center">
            <div className="lg:h-12 flex flex-col !py-3 justify-between">
              <Namer
                name={data?.data?.full_name || "Vape Juice Deport"}
                isVerified
                type="store"
                size="xl"
              />
            </div>
          </div>
          <div className="!mt-2 flex flex-col gap-4 lg:flex-row justify-between items-center">
            <Button
              onClick={() => handleMapClick(data?.data)}
              variant="outline"
              asChild
              className="text-xs flex items-center gap-2"
            >
              <div>
                <MapPinIcon className="size-4" />
                <span>{data?.data?.address?.address || "No Address"}</span>
              </div>
            </Button>
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
                {data?.data?.pl ? (
                  <CheckCircle2Icon className="size-4 text-green-600" />
                ) : (
                  <CircleOffIcon className="size-4 text-destructive" />
                )}
              </div>
            </div>
          </div>
        </div>
        <CartManage id={id as string} />
      </main>
    </>
  );
}
