"use client";
import React, { useState } from "react";
import DOMPurify from 'dompurify';
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
  Delete,
  Facebook,
  Link2,
  LucideDelete,
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
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useDelteArticalMutation } from "@/redux/features/Trending/TrendingApi";
import { usePathname } from "next/navigation";
// import { formatDate } from "@/lib/utils";
import DOMPurify from "dompurify";
interface ArticleProps {
  id: number;
  title: string;
  content: string;
  image: string;
  likeCount: number;
  isLiked: boolean;
  role: string;
  createdAt: string;
}
interface ArticleCardProps {
  article: ArticleProps;
}
export default function ArticleCard({ article, refetch }: { article: ArticleProps; refetch?: any }) {

  const pathname = usePathname();
  console.log('pathnanme', pathname);
  const isMyarticalPage = pathname.includes('my-articles');



  console.log('articleFrom article card', article);
  const [delteArtical, { isLoading }] = useDelteArticalMutation();
  const [copied, setCopied] = useState(false);
  const articleUrl = `${window.location.origin}/trending/article/${article.id}`;

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
      )}&text=${encodeURIComponent(article.title)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366] hover:bg-[#22C55E]",
      url: `https://wa.me/?text=${encodeURIComponent(
        `${article.title} ${articleUrl}`
      )}`,
    },
  ];

  const handleDelete = async (articleId: any) => {
    const confirmed = window.confirm("Are you sure you want to delete this article?");
    if (!confirmed) return;

    console.log('article id', articleId);
    try {
      const response = await delteArtical({ id: articleId }).unwrap();
      console.log('response', response);
      toast.success("Article deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error("Failed to delete article");
    }
  };


  const handleShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };
  const sanitizedContent = DOMPurify.sanitize(article.content);
  return (
    <Card className="!pt-0 overflow-hidden h-full flex flex-col relative">
      <Image
        src={article.image}
        height={500}
        width={800}
        alt={article.title}
        className="aspect-video object-cover hover:scale-105 hover:opacity-80 transition-all"
      />
      <CardHeader>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        {/* <div className="text-sm text-muted-foreground">
          {formatDate(article.createdAt)} • {article.role}
        </div> */}
        <CardDescription
          className="line-clamp-3"


          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        {
          isMyarticalPage && <Dialog>
            <DialogTrigger asChild>
              <button onClick={() => handleDelete(article.id)} className="absolute top-4 right-4 bg-[#FF0000] text-white px-2 py-1 rounded cursor-pointer">
                <p>Delete</p>
              </button>
            </DialogTrigger>
          </Dialog>
        }




          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(article.content),
          }}
        />

      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6 mt-auto">
        <Link href={`/trending/article/${article.id}`}>
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

            <div className="space-y-6">
              {/* Copy Link Section */}
              <div className="space-y-2">
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
              <div className="space-y-3">
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
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick actions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: article.title,
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
                      const subject = encodeURIComponent(article.title);
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
