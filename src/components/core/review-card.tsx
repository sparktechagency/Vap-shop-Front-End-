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
    name: string;
    image: string;
    price: string;
    category: string;
  };
  review?: {
    title: string;
    content: string;
    date: string;
  };
  reviewer?: {
    name: string;
    avatar: string;
    initials: string;
  };
  stats?: {
    helpful: number;
    replies: number;
  };
}

export default function ProductReviewCard({
  product = {
    name: "Premium Wireless Headphones",
    image: "/image/shop/item.jpg",
    price: "$299.99",
    category: "MOD",
  },
  review = {
    title: "Exceptional sound quality and comfort",
    content:
      "These headphones exceeded my expectations in every way. The sound quality is crystal clear with deep bass and crisp highs. I've been using them for both music and work calls, and the noise cancellation is outstanding. The battery life easily lasts a full day of heavy use, and they're incredibly comfortable even during long sessions.",
    date: "2 weeks ago",
  },
  reviewer = {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SJ",
  },
  stats = {
    helpful: 47,
    replies: 3,
  },
}: ProductReviewCardProps) {
  const [helpful, setHelpful] = useState<boolean>(false);
  const [helpfulCount, setHelpfulCount] = useState(stats.helpful);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden w-full">
      {/* Product Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={product.image || "/placeholder.svg"}
              height={600}
              width={600}
              alt={product.name}
              className="w-20 h-20 rounded-lg object-cover border"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 !mb-1">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-base truncate">{product.name}</h3>
            <p className="text-lg font-bold text-primary">{product.price}</p>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="!p-4">
        {/* Rating and Title */}
        <div className="!mb-3">
          <div className="flex items-center gap-2 !mb-2"></div>
          <h4 className="font-semibold text-base !mb-2">{review.title}</h4>
        </div>

        {/* Review Text */}
        <p className="text-sm text-muted-foreground leading-relaxed !mb-4">
          {review.content}
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={reviewer.avatar || "/placeholder.svg"}
                className="object-cover"
              />
              <AvatarFallback className="text-xs">
                {reviewer.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{reviewer.name}</p>
              <p className="text-xs text-muted-foreground">{review.date}</p>
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
                `${newHelpful ? "Marked as helpful" : "Removed helpful mark"}`
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
                Reply ({stats.replies})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>Reply to {reviewer.name}&apos;s review</DialogTitle>
              <DialogDescription className="text-sm">
                Share your thoughts about this review or ask a question about
                the product.
              </DialogDescription>
              <div className="space-y-4">
                <div className="!p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium !mb-1">{review.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {review.content}
                  </p>
                </div>
              </div>
              <DialogFooter className="border-t !pt-4">
                <div className="w-full flex flex-row gap-3">
                  <Input placeholder="Write your reply..." className="flex-1" />
                  <Button>Send</Button>
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
