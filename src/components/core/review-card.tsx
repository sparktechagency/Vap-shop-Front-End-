/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowBigUp,
  Loader2Icon,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Image from "next/image";
import {
  useReplyReviewMutation,
  useToggleLikeMutation,
} from "@/redux/features/others/otherApi";
import Namer from "./internal/namer";
import Link from "next/link";

interface ProductReviewCardProps {
  id: any;
  product_image: string;
  category: any;
  product_name: string;
  average_rating: string;
  product?: {
    id: number;
    name: string;
    image: string;
    price: string;
    category: {
      id: number;
      name: string;
    };
    slug: string;
    role: number;
    roleLabel: string;
    isHearted: boolean;
    totalHeart: number;
    averageRating: string;
  };
  review?: {
    id: number;
    rating: number;
    comment: string;
    date: string;
    parentId: number | null;
  };
  reviewer?: {
    id: number;
    name: string;
    avatar: string;
    role: number;
    roleLabel: string;
    isFollowing: boolean;
    totalFollowers: number;
    totalFollowing: number;
    avgRating: number;
    totalReviews: number;
    isFavourite: boolean;
    isBanned: boolean;
  };
  stats?: {
    helpful: number;
    replies: number;
  };
}

export default function ProductReviewCard({
  data,
  productData,
  role,
  refetch,
}: {
  refetch: any;
  data: any;
  productData?: any;
  role: number;
}) {
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reply, setReply] = useState("");
  const [likeIt] = useToggleLikeMutation();
  const [liking, setLiking] = useState(false);
  const [replier] = useReplyReviewMutation();

  useEffect(() => {
    setMounted(true);
    if (data) {
      if (data?.is_liked) {
        setHelpful(true);
      }
      setHelpfulCount(parseInt(data?.like_count));
    }
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  const handleReplySubmit = async () => {
    if (!reply.trim()) {
      toast("Reply can't be empty.");
      return;
    }

    try {
      const finalizer = {
        role,
        product_id: productData?.id,
        comment: reply,
        parent_id: data.id,
      };
      const replied = await replier(finalizer).unwrap();
      if (!replied.ok) {
        toast.error("Couldn't reply to this review");
      } else {
        toast.success(`Replied to ${data?.user?.first_name}'s Review`);
        refetch();
      }
    } catch (err: any) {
      console.error(err);
    }

    // 🔧 Add reply submission logic here (API call, mutation etc.)
    setReply("");
  };
  console.log("rating", productData);
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden w-full">
      {/* Product Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-4">
          <Image
            src={productData?.data.product_image || "/placeholder.svg"}
            height={600}
            width={600}
            alt={productData?.data?.product_name || "Product Image"}
            className="w-20 h-20 rounded-lg object-cover border"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 !mb-1">
              <Badge variant="secondary" className="text-xs">
                {productData?.data?.category?.name}
              </Badge>
            </div>
            <h3 className="font-semibold text-base truncate">
              {productData?.data?.product_name}
            </h3>
            {/* <p className="text-lg font-bold text-primary">
              ${productData?.product_price}
            </p> */}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="!p-4">
        {data?.rating && (
          <div className="!mb-3">
            <h4 className="font-semibold text-base !mb-2">
              ⭐ {parseFloat(data?.rating).toFixed(1)}/5
            </h4>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed !mb-4">
          {data?.comment}
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={data?.user?.avatar || "/placeholder.svg"}
                className="object-cover"
              />
              <AvatarFallback className="text-xs">
                {data?.user?.full_name
                  ?.split(" ")
                  .map((n: any[]) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={
                  data?.user.role === 5
                    ? `/stores/store/${data?.user.id}`
                    : data?.user.role === 4
                      ? `/brands/brand/${data?.user.id}`
                      : `/profile/${data?.user.id}`
                }
                className="text-sm font-medium"
              >
                {data?.user.full_name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {data?.updated_at
                  ? new Date(data?.updated_at).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="border-t !p-3 flex flex-row justify-between items-center bg-secondary/50">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={liking}
            onClick={async () => {
              if (liking) return; // prevent rapid double click
              setLiking(true);

              const nextHelpful = !helpful;
              const nextCount = helpfulCount + (nextHelpful ? 1 : -1);

              // Optimistic UI update
              setHelpful(nextHelpful);
              setHelpfulCount(nextCount);

              try {
                const res = await likeIt({ id: data?.id }).unwrap();

                if (!res.ok) {
                  // Revert UI if failed
                  setHelpful(!nextHelpful);
                  setHelpfulCount(helpfulCount);
                  toast.error("Failed to mark this review");
                } else {
                  toast.success(
                    `${nextHelpful ? "Marked" : "Unmarked"} ${data?.user?.full_name
                    }'s review as helpful`
                  );
                }
              } catch {
                // Revert on error
                setHelpful(!nextHelpful);
                setHelpfulCount(helpfulCount);
                toast.error("Something went wrong. Please try again");
              } finally {
                setLiking(false);
              }
            }}
            className="text-xs h-8 !px-3"
          >
            <ArrowBigUp
              className="w-4 h-4 !mr-1"
              fill={
                helpful
                  ? resolvedTheme === "dark"
                    ? "#ffffff"
                    : "#191919"
                  : "transparent"
              }
            />
            {helpfulCount}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs h-8 !px-3">
                <MessageCircle className="w-4 h-4 !mr-1" />
                Reply ({data?.replies_count})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogTitle>
                Reply to {data?.user?.first_name}&apos;s review
              </DialogTitle>
              <DialogDescription className="text-sm">
                {data?.comment}
              </DialogDescription>
              <div className="space-y-4! border-t pt-4! h-[70dvh] overflow-y-auto overflow-x-hidden px-2!">
                {data?.replies.map((x: any) => (
                  <div className="!p-3 bg-muted rounded-lg" key={x.id}>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={x.user.avatar} />
                          <AvatarFallback>UI</AvatarFallback>
                        </Avatar>
                        <Link
                          href={
                            data?.user.role === 5
                              ? `/stores/store/${data?.user.id}`
                              : data?.user.role === 4
                                ? `/brands/brand/${data?.user.id}`
                                : `/profile/${data?.user.id}`
                          }
                        >
                          <Namer
                            type={String(x.user.role_label).toLowerCase()}
                            size="sm"
                            name={x.user.full_name}
                          />
                        </Link>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(x?.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="pt-3! text-muted-foreground text-xs">
                      {x.comment}
                    </p>
                  </div>
                ))}
              </div>

              <DialogFooter className="border-t !pt-4">
                <div className="w-full flex flex-row gap-3">
                  <Input
                    placeholder="Write your reply..."
                    className="flex-1"
                    id="reply"
                    name="reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleReplySubmit}>
                    <Send />
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Button variant="ghost" size="sm" className="h-8 !px-3">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
