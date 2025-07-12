/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { useGtStoreDetailsQuery } from "@/redux/features/AuthApi";
import { toast } from "sonner";
import {
  useFollowBrandMutation,
  useUnfollowBrandMutation,
} from "@/redux/features/Trending/TrendingApi";
import DOMPurify from "dompurify";
export default function Page() {
  const { id } = useParams();
  console.log("id", id);
  const { data, isLoading, isError, error, refetch } = useGtStoreDetailsQuery({
    id: id as any,
  });

  const [followOrUnfollowBrand, { isLoading: isFollowing }] =
    useFollowBrandMutation();
  const [unfollowBrand, { isLoading: isUnFollowing }] =
    useUnfollowBrandMutation();

  const user = data?.data;
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Check out ${user?.full_name} on our platform`,
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
            <div className="lg:h-24 flex flex-col !py-3 justify-between">
              <Namer
                name={data?.data?.full_name || "Vape Juice Deport"}
                isVerified
                type="store"
                size="xl"
              />
            </div>
          </div>
          <div className="">
            <p
              className="text-xs md:text-sm xl:text-base line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  data?.data?.about?.content || "No Description"
                ),
              }}
            />
          </div>
          <div className="!mt-2 flex flex-col gap-4 lg:flex-row justify-between items-center">
            <div className="text-xs md:text-sm text-muted-foreground flex gap-2 items-center">
              <span className={"text-green-600"}>Open Now</span>
              <Dotter />
              <span>Close 10 PM</span>
            </div>
            <div className="text-xs flex items-center gap-2">
              <MapPinIcon className="size-4" />
              <span>{data?.data?.address?.address || "No Address"}</span>
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
                <p className="font-semibold text-sm">
                  {user?.total_followers || 0} followers
                </p>
                <Button
                  variant="outline"
                  className="!text-sm font-extrabold"
                  asChild
                >
                  <Link href="/stores/store/btb">B2B</Link>
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
          <TabsTriggerer id={id} />
        </div>
      </main>
    </>
  );
}
