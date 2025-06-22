'use client';
import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquareMoreIcon, Share2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import TabsTriggerer from "../tabs-trigger";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { useFollowBrandMutation, useUnfollowBrandMutation } from "@/redux/features/Trending/TrendingApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useGetBrandDetailsByIdQuery, useGetMostHurtedBrandQuery } from "@/redux/features/brand/brandApis";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const params = useParams();
  const id = params.id;

  const { data: brandDetails, isLoading, refetch } = useGetBrandDetailsByIdQuery(id as any);
  const [followOrUnfollowBrand, { isLoading: isFollowing }] = useFollowBrandMutation();
  const [unfollowBrand, { isLoading: isUnFollowing }] = useUnfollowBrandMutation();
  const { data: mosthurtedBrands, isLoading: isMostHurtedloading } = useGetMostHurtedBrandQuery(id as any);
  const mostHutedBrands = mosthurtedBrands?.data?.products?.data

  const user = brandDetails?.data?.user;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out ${user?.full_name} on our platform`,
        text: `I found this amazing brand ${user?.full_name} that you might like!`,
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Link copied to clipboard!');
        })
        .catch(() => {
          const tempInput = document.createElement('input');
          tempInput.value = shareUrl;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          toast.success('Link copied to clipboard!');
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

  if (isLoading || isMostHurtedloading) {
    return (
      <main className="!py-12 !p-4 lg:!px-[7%]">
        <div className="">
          <div className="flex flex-col md:flex-row !py-4 gap-4">
            <Skeleton className="size-24 rounded-full" />
            <div className="h-24 flex flex-col !py-3 justify-between gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex-1 md:h-24 grid grid-cols-1 md:flex flex-row justify-end items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
        <div className="w-full mt-8">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="!py-12 !p-4 lg:!px-[7%]">
      <div className="">
        <div className="flex flex-col md:flex-row !py-4 gap-4">
          <Avatar className="size-24">
            <AvatarImage src={`${user?.avatar}`} />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div className="h-24 flex flex-col !py-3 justify-between">
            <Namer name={user?.full_name} isVerified type="brand" size="xl" />
            <Link
              href={"#"}
              className="text-purple-700 hover:text-purple-900 underline"
            >
              ({user?.total_reviews} Reviews)
            </Link>
          </div>
          <div className="flex-1 md:h-24 grid grid-cols-1 md:flex flex-row justify-end items-center gap-4">
            <p className="font-semibold text-sm">{user?.total_followers} followers</p>
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
              <Link href="/chat">
                <MessageSquareMoreIcon />
              </Link>
            </Button>
            {
              user?.is_following ? (
                <Button onClick={() => handleUnfollow(user?.id)} variant="outline">
                  {isUnFollowing ? "Unfollowing..." : "Unfollow"}
                </Button>
              ) : (
                <Button onClick={() => handleFollow(user?.id)} variant="outline">
                  {isFollowing ? "Following..." : "Follow"}
                </Button>
              )
            }
            <Button onClick={handleShare} variant="outline" className="w-full md:w-9" size="icon">
              <Share2Icon />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <TabsTriggerer id={id} />
      </div>
    </main>
  );
}