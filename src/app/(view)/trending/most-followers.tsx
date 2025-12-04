"use client";
import BrandProdCard from "@/components/core/brand-prod-card";
import React, { useState, useEffect } from "react";
import {
  useGetGalleryQuery,
  useGetmostFollowrsBrandQuery,
  useGetSponsoredBrandsQuery,
} from "@/redux/features/Trending/TrendingApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountysQuery } from "@/redux/features/AuthApi";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  ChevronDownIcon,
  ChevronLeft,
  Globe,
  HeartIcon,
  Loader2Icon,
} from "lucide-react";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { IoCopySharp } from "react-icons/io5";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { usePosHeartMutation } from "@/redux/features/others/otherApi";

export default function MostFollowers() {
  const [region, setRegion] = useState(""); // empty = worldwide
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [likePost, { isLoading: liking }] = usePosHeartMutation();
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchMostFollowers,
  }: any = useGetGalleryQuery();
  // { region }

  const {
    data: sponsored,
    isLoading: sponsoredLoading,
    isError: isSponsoredError,
    error: sponsoredError,
    refetch: refetchSponsored,
  }: any = useGetSponsoredBrandsQuery({ region });

  const { data: countries, isLoading: cLoading } = useCountysQuery();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  useEffect(() => {
    refetchMostFollowers();
    refetchSponsored();
  }, [region, refetchMostFollowers, refetchSponsored]);

  const handleSelectRegion = (val: string) => {
    setRegion(val);
    setOpen(false);
  };

  if (isLoading || sponsoredLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Region Popover */}
      <div className="w-full flex justify-end items-center gap-6 !my-6">
        {!cLoading && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-[180px] justify-between transition"
              >
                {region === ""
                  ? "Worldwide"
                  : (() => {
                      const country = countries?.data?.find((c: any) =>
                        c.regions.some((r: any) => r.id.toString() === region)
                      );
                      const regionData = country?.regions?.find(
                        (r: any) => r.id.toString() === region
                      );
                      return regionData
                        ? `${regionData.name} (${regionData.code})`
                        : "Select Region";
                    })()}
                <ChevronDownIcon
                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[340px]! p-2" align="end">
              {selectedCountry ? (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCountry(null)}
                    className="text-muted-foreground flex items-center gap-1 mb-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  {selectedCountry.regions.map((r: any) => (
                    <Button
                      key={r.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSelectRegion(r.id.toString())}
                    >
                      {r.name} ({r.code})
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectRegion("")}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Globe className="w-4 h-4" /> Worldwide
                  </Button>

                  {countries?.data?.map((c: any) => (
                    <Button
                      key={c.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCountry(c)}
                    >
                      {c.name}
                    </Button>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Sponsored brands */}
      {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
        {isSponsoredError ? (
          <div className="py-4 col-span-4 flex justify-center items-center">
            {sponsoredError?.data?.message}
          </div>
        ) : (
          <>
            {sponsored?.data?.map((item: any, i: number) => (
              <BrandProdCard
                data={{
                  id: item?.id,
                  image: item?.user?.avatar,
                  storeName: item?.full_name,
                  is_favourite: item?.is_favourite,
                  isVerified: true,
                  location: {
                    city: "BROOKLYN, New York",
                    distance: "4 mi",
                  },
                  rating: {
                    value: item?.avg_rating,
                    reviews: item?.total_reviews,
                  },
                  isOpen: true,
                  closingTime: item?.end_date,
                  type: "ad",
                  isFollowing: item?.is_following,
                  totalFollowers: item?.total_followers,
                }}
                key={i}
              />
            ))}
            {sponsored?.data?.length <= 0 && (
              <div className="flex justify-center items-center h-12 w-full">
                No Sponsored Brands Found
              </div>
            )}
          </>
        )}
      </div> */}

      <h2 className="font-semibold text-2xl !mt-12 text-center">
        Top 50 Most Discovered
      </h2>
      {/* Most followed brands */}
      {isError ? (
        <div className="py-4 flex justify-center items-center">
          {error?.data?.message}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 !my-6">
          {data?.data?.map((item: any) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card
                  className="w-full relative aspect-[4/5] bg-cover rounded-none overflow-hidden"
                  style={{
                    backgroundImage: `url('${item?.post_images[0]?.image_path}')`,
                  }}
                >
                  {item?.post_images?.length > 1 && (
                    <div className="top-2 right-2 absolute z-20">
                      <div className="text-background p-2 rounded-lg bg-background/30">
                        <IoCopySharp className="size-5" />
                      </div>
                    </div>
                  )}
                  <div className="h-full w-full absolute top-0 left-0 z-30 hover:bg-foreground/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer" />
                  <div className="absolute bottom-0 right-0 px-4 py-2 rounded-sm bg-background flex items-center gap-2">
                    <HeartIcon className="size-5" /> {item.hearts_count}
                  </div>
                </Card>
              </DialogTrigger>

              <DialogContent className="h-[90dvh] !min-w-fit px-[4%]! gap-0!">
                <DialogHeader className="hidden">
                  <DialogTitle />
                </DialogHeader>

                <div className="w-full flex justify-center items-center">
                  <Carousel className="w-[60dvh]" setApi={setApi}>
                    <CarouselContent>
                      {item.post_images.map((img: any, i: number) => (
                        <CarouselItem key={i}>
                          <div className="p-1">
                            <Card className="aspect-square! p-0!">
                              <CardContent className="flex aspect-square! items-center justify-center p-0! ">
                                <ImageZoom
                                  onZoomChange={() => {
                                    //keep dialog open
                                  }}
                                >
                                  <Image
                                    src={img?.image_path}
                                    height={500}
                                    width={500}
                                    alt={`Post image ${i + 1}`}
                                    className="w-full h-full object-contain aspect-square rounded-md"
                                  />
                                </ImageZoom>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>

                <div className="flex gap-2 mt-2 w-full justify-center items-center">
                  {Array.from({ length: count }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        current === i + 1
                          ? "bg-foreground w-4"
                          : "bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <DialogFooter className="mt-0 pt-0 flex justify-start items-center">
                  <Button
                    variant="special"
                    onClick={async () => {
                      try {
                        const res = await likePost({ id: item.id }).unwrap();

                        if (!res.ok) {
                          throw new Error("Failed to update like status.");
                        }

                        toast.success(
                          `${!item.is_hearted ? "Hearted" : "Unhearted"} post!`
                        );
                        // toast.success(`${post.is_ ? "Liked" : "Unliked"} post!`);
                      } catch (err: any) {
                        // Revert optimistic update
                        // setLiked(!nextLiked);
                        // setTotalLike((prev) => prev + (nextLiked ? -1 : 1));

                        toast.error(
                          err?.data?.message ||
                            "Something went wrong. Please try again."
                        );
                        console.error("Like error:", err);
                      }
                    }}
                    className="text-xs h-8 !px-3"
                    disabled={liking}
                  >
                    <HeartIcon
                      className={cn("w-4 h-4 !mr-1", liking ? "hidden" : "")}
                      fill={
                        item.is_hearted
                          ? resolvedTheme === "dark"
                            ? "#ffffff"
                            : "#dc2626"
                          : "transparent"
                      }
                    />
                    {liking && <Loader2Icon className="animate-spin" />}
                    {item.hearts_count}
                  </Button>
                </DialogFooter>

                <div className="border-t mt-4 pt-4">
                  <p
                    className="text-xs text-muted-foreground line-clamp-1"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        item.content || "No description available."
                      ),
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
          {data?.data?.length <= 0 && (
            <div className="flex justify-center items-center h-12 w-full">
              No Most Followed Brand Found
            </div>
          )}
        </div>
      )}
    </>
  );
}
