"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import {
  Check,
  Copy,
  Facebook,
  Link2,
  MailIcon,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// import {
//   FacebookShareButton,
//   InstapaperShareButton,
//   TwitterShareButton,
//   WhatsappShareButton,
// } from "react-share";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import Link from "next/link";

export default function ArticleCard() {
  const [copied, setCopied] = useState(false);
  const articleUrl = "https://www.example.com/article";
  const articleTitle = "Amazing Article Title";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      toast("Link copied!", {
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", {
        description: "Please copy the link manually.",
      });
    }
  };

  const shareButtons = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#166FE5]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        articleUrl
      )}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1A91DA]",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        articleUrl
      )}&text=${encodeURIComponent(articleTitle)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366] hover:bg-[#22C55E]",
      url: `https://wa.me/?text=${encodeURIComponent(
        `${articleTitle} ${articleUrl}`
      )}`,
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };
  return (
    <Card className="!pt-0  overflow-hidden">
      <Image
        src="/image/trends.jpg"
        height={1920}
        width={1280}
        alt="article"
        className="aspect-video object-cover hover:scale-105 hover:opacity-80 transition-all"
      />
      <CardHeader>
        <CardTitle>The Ultimate Beginner&apos;s Guide to Vaping</CardTitle>
        <CardDescription className="line-clamp-4">
          Stepping into the vape world can feel overwhelming with all the
          devices, flavors, and nicotine options out there. This guide breaks
          everything down into easy steps—perfect for anyone new to vaping.
          We’ll cover the basics of how vapes work, how to choose your first
          setup, what e-liquids are best for beginners, and tips to avoid common
          mistakes. Whether you&apos;re switching from smoking or just curious
          about vaping, this one’s your go-to manual...
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        <Link href="/trending/article">
          <button className="w-full !py-4 rounded-lg outline-2 flex justify-center items-center cursor-pointer hover:bg-secondary transition-colors text-xs md:text-base">
            View Article
          </button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full !py-4 rounded-lg outline-2 flex justify-center items-center cursor-pointer hover:bg-secondary transition-colors text-xs md:text-base">
              <Share2 className="size-3 md:size-5 mr-1! md:mr-2!" />
              Share
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="size-5" />
                Share this article
              </DialogTitle>
              <DialogDescription>
                Share this article with your friends and followers
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6!">
              {/* Copy Link Section */}
              <div className="space-y-2!">
                <Label htmlFor="link" className="text-sm font-medium">
                  Article Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="link"
                    value={articleUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Social Share Buttons */}
              <div className="space-y-3!">
                <Label className="text-sm font-medium">
                  Share on social media
                </Label>
                <div className="grid gap-3">
                  {shareButtons.map((platform) => (
                    <Button
                      key={platform.name}
                      variant="outline"
                      className={`w-full justify-start gap-3 h-12 text-white border-0 ${platform.color}`}
                      onClick={() => handleShare(platform.url)}
                    >
                      <platform.icon className="size-5" />
                      Share on {platform.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Share Options */}
              <div className="space-y-3!">
                <Label className="text-sm font-medium">Quick actions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: articleTitle,
                          url: articleUrl,
                        });
                      } else {
                        copyToClipboard();
                      }
                    }}
                    className="justify-center gap-2"
                  >
                    <Link2 className="size-4" />
                    Native Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const subject = encodeURIComponent(articleTitle);
                      const body = encodeURIComponent(
                        `Check out this article: ${articleUrl}`
                      );
                      window.open(`mailto:?subject=${subject}&body=${body}`);
                    }}
                    className="justify-center gap-2"
                  >
                    <MailIcon />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
