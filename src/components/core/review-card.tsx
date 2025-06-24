"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, Loader2Icon, MessageCircle, Share2 } from "lucide-react";
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

interface ProductReviewCardProps {
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
}: {
  data: ProductReviewCardProps;
}) {
  const { product, review, reviewer, stats } = data;
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(stats?.helpful ?? 0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  const handleReplySubmit = () => {
    if (!reply.trim()) {
      toast("Reply can't be empty.");
      return;
    }

    // 🔧 Add reply submission logic here (API call, mutation etc.)
    toast(`Reply sent: "${reply}"`);
    setReply("");
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden w-full">
      {/* Product Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-4">
          <Image
            src={product?.image || "/placeholder.svg"}
            height={600}
            width={600}
            alt={product?.name || "Product Image"}
            className="w-20 h-20 rounded-lg object-cover border"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 !mb-1">
              <Badge variant="secondary" className="text-xs">
                {product?.category?.name}
              </Badge>
            </div>
            <h3 className="font-semibold text-base truncate">
              {product?.name}
            </h3>
            <p className="text-lg font-bold text-primary">{product?.price}</p>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="!p-4">
        {review?.rating && (
          <div className="!mb-3">
            <h4 className="font-semibold text-base !mb-2">
              ⭐ {review.rating}/5
            </h4>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed !mb-4">
          {review?.comment}
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={reviewer?.avatar || "/placeholder.svg"}
                className="object-cover"
              />
              <AvatarFallback className="text-xs">
                {reviewer?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{reviewer?.name}</p>
              <p className="text-xs text-muted-foreground">
                {review?.date
                  ? new Date(review.date).toLocaleDateString()
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
            onClick={() => {
              const newHelpful = !helpful;
              setHelpful(newHelpful);
              setHelpfulCount((prev) => (newHelpful ? prev + 1 : prev - 1));
              toast(
                `${newHelpful ? "Marked as helpful" : "Unmarked as helpful"}`
              );
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
                Reply ({stats?.replies ?? 0})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>Reply to {reviewer?.name}&apos;s review</DialogTitle>
              <DialogDescription className="text-sm">
                Share your thoughts or ask a question about the product.
              </DialogDescription>
              <div className="space-y-4">
                <div className="!p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium !mb-1">
                    {review?.rating ? `⭐ ${review.rating}/5` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {review?.comment}
                  </p>
                </div>
              </div>

              <DialogFooter className="border-t !pt-4">
                <div className="w-full flex flex-row gap-3">
                  <Input
                    placeholder="Write your reply..."
                    className="flex-1"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <Button onClick={handleReplySubmit}>Send</Button>
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
