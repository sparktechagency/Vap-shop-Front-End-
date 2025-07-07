/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageSquareMoreIcon,
  Share2Icon,
  CopyIcon,
  MailIcon,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import ProductCard from "@/components/core/product-card";
import { useParams } from "next/navigation";
import {
  useFollowBrandMutation,
  useTrendingProductDetailsByIdQuery,
  useUnfollowBrandMutation,
} from "@/redux/features/Trending/TrendingApi";
import LoadingScletion from "@/components/LoadingScletion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from "react-share";
import { Separator } from "@/components/ui/separator";
import { useGetReviewsQuery } from "@/redux/features/others/otherApi";
import ProductReviewCard from "@/components/core/review-card";
import Reviewer from "./reviewer";
import ReviewPost from "./review-post";

const accordionData = [
  {
    id: "features",
    title: "Key Features",
    content:
      "Discover the standout features of this product including its specifications and unique selling points.",
  },
  {
    id: "specifications",
    title: "Technical Specifications",
    content: (
      <ul>
        <li>Product details and specifications</li>
      </ul>
    ),
  },
  {
    id: "what-in-the-box",
    title: "What's in the Box",
    content: (
      <ul>
        <li>Standard packaging contents</li>
      </ul>
    ),
  },
  {
    id: "how-to-use",
    title: "How to Use",
    content: (
      <ol>
        <li>Basic usage instructions</li>
      </ol>
    ),
  },
  {
    id: "safety-precautions",
    title: "Safety Precautions",
    content: (
      <ul>
        <li>Important safety information</li>
      </ul>
    ),
  },
];

interface ShareButtonsProps {
  url: string;
  title: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionItemType {
  id: string;
  title: string;
  content: string | React.ReactNode;
}


const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  return (
    <div className="flex justify-center gap-4 pt-4">
      <FacebookShareButton url={url} hashtag="#vapeshopmaps">
        <Button variant="outline" size="icon">
          <FaFacebook className="h-5 w-5 text-blue-600" />
        </Button>
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <Button variant="outline" size="icon">
          <FaTwitter className="h-5 w-5 text-blue-400" />
        </Button>
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title}>
        <Button variant="outline" size="icon">
          <FaLinkedin className="h-5 w-5 text-blue-700" />
        </Button>
      </LinkedinShareButton>
      <EmailShareButton url={url} subject={title}>
        <Button variant="outline" size="icon">
          <MailIcon className="h-5 w-5 text-gray-600" />
        </Button>
      </EmailShareButton>
    </div>
  );
};

export default function Page() {
  const params = useParams();
  const id = params.id;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
  } = useTrendingProductDetailsByIdQuery(id as any);
  const [followOrUnfollowBrand, { isLoading: isFollowing }] =
    useFollowBrandMutation();
  const [unfollowBrand, { isLoading: isUnFollowing }] =
    useUnfollowBrandMutation();
  console.log("product", product);




  const getFAQAccordionItems = (): AccordionItemType[] => {
    if (!product?.data?.product_faqs?.length) return [];

    return product.data.product_faqs.map((faq: FAQItem, index: number) => ({
      id: `faq-${index}`,
      title: faq.question,
      content: faq.answer,
    }));
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingScletion />
      </div>
    );
  }

  const handleFollow = async (id: string) => {
    try {
      const response = await followOrUnfollowBrand(id).unwrap();
      console.log("Toggled follow/unfollow for brand:", response);
      if (response.ok) {
        toast.success(response.message || "Followed successfully");
        refetch();
      }
    } catch (error: any) {
      console.error("Error toggling follow:", error);
      toast.error(error?.data?.message || "Failed to follow");
    }
  };

  const handleUnfollow = async (id: string) => {
    try {
      const response = await unfollowBrand(id).unwrap();
      console.log("Toggled follow/unfollow for brand:", response);
      if (response.ok) {
        toast.success(response.message || "Unfollowed successfully");
        refetch();
      }
    } catch (error: any) {
      console.error("Error toggling follow:", error);
      toast.error(error?.data?.message || "Failed to unfollow");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: product?.data?.product_name || "Check out this product",
        url: currentUrl,
      });
    } catch (err) {
      console.log("Native share not supported, falling back to dialog");
      setIsShareDialogOpen(true);
    }
  };

  const formatPrice = () => {
    if (!product) return "$0.00";
    const price = parseFloat(product?.data?.product_price);
    if (product.product_discount) {
      const discount = parseFloat(product.product_discount) / 100;
      const discountedPrice = price * (1 - discount);
      return (
        <>
          <span className="line-through text-muted-foreground mr-2">
            ${price.toFixed(2)}
          </span>
          <span className="text-primary font-bold">
            ${discountedPrice.toFixed(2)}
          </span>
          <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            {product.product_discount} off
          </span>
        </>
      );
    }
    return `$${price.toFixed(2)}`;
  };

  const getAccordionData = () => {
    const updatedAccordionData = [...accordionData];

    const howToUseIndex = updatedAccordionData.findIndex(
      (item) => item.id === "how-to-use"
    );
    if (howToUseIndex !== -1 && product?.product_faqs?.length) {
      updatedAccordionData[howToUseIndex].content = (
        <div>
          {product.product_faqs.map((faq: any, index: number) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold">{faq.question}</h4>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      );
    }

    return updatedAccordionData;
  };



  console.log("product", product);
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Product not found
      </div>
    );
  }

  return (
    <main className="!py-12">
      <div className="!px-4 lg:!px-[7%] !pb-12">
        <div className="flex !py-4 gap-4 ">
          <Avatar className="size-24 border">
            <AvatarImage
              src={product?.data?.user?.avatar || "/image/icon/brand.jpg"}
              alt={`${product?.data?.user?.avatar} Brand Logo`}
            />
          </Avatar>
          <div className="h-24 flex flex-col !py-3 justify-center">
            <Link
              href={`/brands/brand/${product?.data?.user?.id}`}
              className="text-black hover:text-[#3a3a3a] underline"
            >
              <Namer
                name={product?.data?.user?.full_name || "Brand"}
                isVerified
                type="brand"
                size="xl"
              />
            </Link>
          </div>
          <div className="flex-1 h-24 flex flex-row justify-end items-center gap-4">
            <p className="font-semibold text-sm">
              {product?.data?.user?.total_followers?.toLocaleString() || "0"}{" "}
              followers
            </p>
            <Button variant="outline" className="!text-sm font-extrabold">
              B2B
            </Button>
            <Button variant="outline" size="icon">
              <MessageSquareMoreIcon />
            </Button>
            {product?.data?.user?.is_following ? (
              <Button
                onClick={() => handleUnfollow(product?.data?.user?.id)}
                variant="outline"
              >
                {isUnFollowing ? "Unfollowing..." : "Unfollow"}
              </Button>
            ) : (
              <Button
                onClick={() => handleFollow(product?.data?.user?.id)}
                variant="outline"
              >
                {isFollowing ? "Following..." : "Follow"}
              </Button>
            )}

            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={handleNativeShare}
                  variant="outline"
                  size="icon"
                >
                  <Share2Icon />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share this product</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Input value={currentUrl} readOnly />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="px-3"
                    onClick={copyToClipboard}
                  >
                    <span className="sr-only">Copy</span>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
                <ShareButtons
                  url={currentUrl}
                  title={
                    product?.data?.product_name || "Check out this product"
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-9 !py-12 bg-secondary dark:bg-zinc-900 !px-4 lg:!px-[7%] gap-8">
        <div className="col-span-1 lg:col-span-5">
          <h1 className="text-4xl lg:text-6xl font-semibold !mb-6">
            {product?.data?.product_name || "Brand"}
          </h1>
          <div className="text-2xl font-bold !mb-4">{formatPrice()}</div>
          <p className="text-muted-foreground !mb-8">
            {product.product_description ||
              "Premium product with excellent features."}
          </p>
          <div className="w-full lg:w-2/3">
            <Accordion type="single" collapsible>
              {getFAQAccordionItems().map((item: AccordionItemType) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-4">
          <Image
            src={product.product_image || "/image/shop/item.jpg"}
            width={800}
            height={800}
            alt={product?.data?.product_name}
            className="aspect-square object-cover object-center w-full rounded-md shadow-lg"
          />
        </div>
      </div>
      <div className="!px-4 lg:!px-[7%] !py-20">
        <h3 className="text-2xl !mb-20">
          Looking more from{" "}
          <Link href={`#`} className="underline font-semibold">
            {product?.data?.user?.full_name || "Brand"}
          </Link>
          ?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product?.data?.related_products
            ?.slice(0, 4)
            .map((relatedProduct: any) => (
              <ProductCard
                key={relatedProduct.id}
                link={`${relatedProduct.id}`}
                data={{
                  image: relatedProduct.product_image || "/image/shop/item.jpg",
                  title: relatedProduct.product_name,
                  category: relatedProduct.category?.name || "Product",
                  note: `$${parseFloat(relatedProduct.product_price).toFixed(
                    2
                  )}`,
                  discount: relatedProduct.product_discount,
                  hearts: relatedProduct.total_heart,
                  rating: parseFloat(
                    relatedProduct.average_rating || "0"
                  ).toFixed(1),
                }}
              />
            ))}
        </div>
        <ReviewPost role={3} productId={product?.data?.id} />
        <Separator />

        {product && <Reviewer product={product.data} />}
      </div>
    </main>
  );
}
