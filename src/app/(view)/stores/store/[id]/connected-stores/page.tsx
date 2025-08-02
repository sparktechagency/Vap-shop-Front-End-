/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleOffIcon,
  Loader2Icon,
  MapPinIcon,
  MessageSquareMoreIcon,
  Share2Icon,
} from "lucide-react";
import React from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGtStoreDetailsQuery } from "@/redux/features/AuthApi";
import { toast } from "sonner";
import {
  useFollowBrandMutation,
  useUnfollowBrandMutation,
} from "@/redux/features/Trending/TrendingApi";
import OpenStatus from "../open-status";
import { useGetActiveLocationsQuery } from "@/redux/features/others/otherApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function Page() {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useGtStoreDetailsQuery({
    id: id as any,
  });
  const {
    data: locations,
    isLoading: locationLoading,
    isError: locationError,
  } = useGetActiveLocationsQuery({ id });
  console.log(data?.data);
  const navigation = useRouter();
  const [followOrUnfollowBrand, { isLoading: isFollowing }] =
    useFollowBrandMutation();
  const [unfollowBrand, { isLoading: isUnFollowing }] =
    useUnfollowBrandMutation();

  const user = data?.data;
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Check out ${user?.full_name} on our Vape shop maps`,
          text: `I found this amazing brand ${user?.full_name} that you might like!`,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      const shareUrl = window.location.href;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          const tempInput = document.createElement("input");
          tempInput.value = shareUrl;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          toast.success("Link copied to clipboard!");
        });
    }
  };

  const handleFollow = async (id: string) => {
    try {
      const response = await followOrUnfollowBrand(id).unwrap();
      if (response.ok) {
        toast.success(response.message || "Followed successfully");
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to follow");
    }
  };

  const handleUnfollow = async (id: string) => {
    try {
      const response = await unfollowBrand(id).unwrap();
      if (response.ok) {
        toast.success(response.message || "Unfollowed successfully");
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to unfollow");
    }
  };

  const handleMapClick = (data: any) => {
    console.log("data", data);
    navigation.push(
      `/map?lat=${data?.address?.latitude}&lng=${data?.address?.longitude}`
    );
  };

  if (isError) {
    console.log("error", error);
  }
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
            <div className="text-xs md:text-sm text-muted-foreground">
              <OpenStatus
                openFrom={data?.data?.open_from}
                openTo={data?.data?.close_at}
              />
            </div>
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
              <div className="text-xs cursor-pointer hover:text-foreground/80">
                <Link
                  href={`/stores/store/${data?.data?.id}`}
                  className="flex items-center gap-2 "
                >
                  <ArrowLeftIcon className="size-4" />
                  Go back
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
              <div className="flex-1 md:h-24 grid grid-cols-1 md:flex flex-row justify-end items-center gap-4">
                <p className="font-semibold text-sm">
                  {user?.total_followers || 0} followers
                </p>
                <Button
                  variant="outline"
                  className="!text-sm font-extrabold"
                  asChild
                >
                  <Link href={`/stores/store/${id}/btb`}>B2B</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-9"
                  size="icon"
                  asChild
                >
                  <Link href={`/chat?email=${user?.email}`}>
                    <MessageSquareMoreIcon />
                  </Link>
                </Button>
                {user?.is_following ? (
                  <Button
                    onClick={() => handleUnfollow(user?.id)}
                    variant="outline"
                  >
                    {isUnFollowing ? "Unfollowing..." : "Unfollow"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleFollow(user?.id)}
                    variant="outline"
                  >
                    {isFollowing ? "Following..." : "Follow"}
                  </Button>
                )}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full md:w-9"
                  size="icon"
                >
                  <Share2Icon />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h2 className="w-full border-b text-3xl font-bold">
            Connected Locations
          </h2>
          <div className="grid grid-cols-4 gap-6 mt-6">
            {!locationLoading &&
              !locationError &&
              locations?.data?.data?.map((item: any) => (
                <Card key={item.id} className="pt-0!">
                  <CardContent
                    className="h-64 w-full bg-cover bg-center rounded-t-xl"
                    style={{ backgroundImage: `url('${item?.owner?.avatar}')` }}
                  />
                  <CardHeader>
                    <CardTitle>{item?.branch_name}</CardTitle>
                    <CardDescription>{item?.address.address}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
          </div>
          {/* {!locationLoading && (
            <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
              <code className="whitespace-pre-wrap">
                {JSON.stringify(locations.data.data, null, 2)}
              </code>
            </pre>
          )} */}
        </div>
      </main>
    </>
  );
}
