/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
interface FAQAccordionItem {
  id: string;
  title: string;
  content: string;
}
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
import { useParams, usePathname } from "next/navigation";
import {
  useFollowBrandMutation,
  useStoreProductDetailsByIdQuery,
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
import ReviewPost from "../../[id]/review-post";
import Reviewer from "../../[id]/reviewer";
import { ProductPrice } from "@/components/ui/ProductPrice";
import DOMPurify from "dompurify";

interface ShareButtonsProps {
  url: string;
  title: string;
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
  const { store } = params;

  const pathname = usePathname();
  const isStorePage = pathname.includes("/stores/");

  const id = params.id;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const {
    data: product,
    isLoading,
    refetch,
  } = useStoreProductDetailsByIdQuery(id as any);

  // Add this hook to fetch reviews
  const { data: reviewsData, isLoading: isReviewsLoading } = useGetReviewsQuery(
    {
      role: 5,
      id: product?.data?.id,
    }
  );

  const [followOrUnfollowBrand, { isLoading: isFollowing }] =
    useFollowBrandMutation();
  const [unfollowBrand, { isLoading: isUnFollowing }] =
    useUnfollowBrandMutation();

  if (isLoading || isReviewsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingScletion />
      </div>
    );
  }
  // Simplified FAQ accordion data mapping
  const faqAccordionItems =
    product?.data?.product_faqs?.map((faq: any, index: number) => ({
      id: `faq-${index}`,
      title: faq.question,
      content: faq.answer,
    })) || [];

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
      setIsShareDialogOpen(true);
    }
  };
  const brandLink = isStorePage
    ? `/stores/store/${product?.data?.user?.id}`
    : `/brands/brand/${product?.data?.user?.id}`;

  const formatPrice = () => {
    if (!product?.data?.product_price) return "Contact for pricing";
    const price = parseFloat(product.data.product_price);
    return `$${price.toFixed(2)}`;
  };

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
              // href={brandLink}
              href={`/stores/store/${product?.data?.user?.id} `}
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
            {/* <Button variant="outline" className="!text-sm font-extrabold">
              B2B
            </Button> */}
            <Button variant="outline" size="icon" asChild>
              <Link href={`/chat?email=${product?.data?.user?.email}`}>
                <MessageSquareMoreIcon />
              </Link>
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
          <p
            className="text-muted-foreground !mb-8"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                product?.data?.product_description ||
                  "Premium product with excellent features."
              ),
            }}
          />
          <div className="w-full lg:w-2/3">
            {faqAccordionItems.length > 0 ? (
              <Accordion type="single" collapsible>
                {faqAccordionItems.map((item: FAQAccordionItem) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">
                No FAQs available for this product
              </p>
            )}
          </div>
        </div>
        <div className="col-span-1 lg:col-span-4">
          <Image
            src={product?.data?.product_image || "/image/shop/item.jpg"}
            width={800}
            height={800}
            alt={product?.data?.product_name}
            className="aspect-square object-cover object-center w-full rounded-md shadow-lg"
          />
          {product?.data?.stock < 1 ? (
            <div className="flex items-center justify-end mt-4">
              <p className="text-red-500 font-bold">Out of Stock</p>
            </div>
          ) : null}
          <div
            className={`flex items-center justify-end mt-4 ${
              product?.data?.stock < 1 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <ProductPrice
              currentPrice={
                parseFloat(product?.data?.product_price || "0.0") ??
                "Contact for Pricing"
              }
              originalPrice={
                product?.data?.original_price &&
                parseFloat(product.data.original_price) > 0
                  ? parseFloat(product.data.original_price)
                  : undefined
              }
              productId={product?.data?.id || ""}
              description={product?.data?.product_description || ""}
              productName={product?.data?.product_name || ""}
              productImage={product?.data?.product_image}
            />
          </div>
        </div>
      </div>
      <div className="!px-4 lg:!px-[7%] !py-20">
        <h3 className="text-2xl !mb-20">
          Looking more from{" "}
          <Link
            href={`/stores/store/${product.data.user.id ?? ""}`}
            className="underline font-semibold"
          >
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

                  price: relatedProduct.product_price,
                  discount: relatedProduct.product_discount,
                  hearts: relatedProduct.total_heart,
                  rating: parseFloat(
                    relatedProduct.average_rating || "0"
                  ).toFixed(1),
                }}
              />
            ))}
        </div>

        {/* Reviews Section */}
        <ReviewPost role={5} productId={product?.data?.id} />
        <Separator />
        {/* Pass reviews data to Reviewer component */}
        {reviewsData && <Reviewer product={product} role={5} />}
      </div>
    </main>
  );
}
