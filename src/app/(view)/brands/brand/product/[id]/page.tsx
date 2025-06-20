'use client';

import React from "react";
import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquareMoreIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import ProductCard from "@/components/core/product-card";
import { useParams, useSearchParams } from "next/navigation";
import { useTrendingProductDetailsByIdQuery } from "@/redux/features/Trending/TrendingApi";
import LoadingScletion from "@/components/LoadingScletion";

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

export default function Page() {
  const params = useParams();
  const id = params.id;

  const { data: product, isLoading } = useTrendingProductDetailsByIdQuery(id as any);
  console.log('product', product);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingScletion />
      </div>
    )
  }

  // Format price with discount if available
  const formatPrice = () => {
    if (!product) return "$0.00";
    const price = parseFloat(product?.data?.product_price);
    if (product.product_discount) {
      const discount = parseFloat(product.product_discount) / 100;
      const discountedPrice = price * (1 - discount);
      return (
        <>
          <span className="line-through text-muted-foreground mr-2">${price.toFixed(2)}</span>
          <span className="text-primary font-bold">${discountedPrice.toFixed(2)}</span>
          <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            {product.product_discount} off
          </span>
        </>
      );
    }
    return `$${price.toFixed(2)}`;
  };

  // Update accordion content with product FAQs if available
  const getAccordionData = () => {
    const updatedAccordionData = [...accordionData];

    // Update How to Use section with product FAQs
    const howToUseIndex = updatedAccordionData.findIndex(item => item.id === "how-to-use");
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
            <AvatarImage src={product?.data?.user?.avatar || "/image/icon/brand.jpg"} alt={`${product?.data?.user?.avatar} Brand Logo`} />

          </Avatar>
          <div className="h-24 flex flex-col !py-3 justify-center">
            <Namer
              name={product?.data?.user?.full_name || "Brand"}
              isVerified
              type="brand"
              size="xl"
            />
          </div>
          <div className="flex-1 h-24 flex flex-row justify-end items-center gap-4">
            <p className="font-semibold text-sm">
              {product.user?.total_followers?.toLocaleString() || "0"} followers
            </p>
            <Button variant="outline" className="!text-sm font-extrabold">
              B2B
            </Button>
            <Button variant="outline" size="icon">
              <MessageSquareMoreIcon />
            </Button>
            <Button variant="outline">Follow</Button>
            <Button variant="outline" size="icon">
              <Share2Icon />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-9 !py-12 bg-secondary dark:bg-zinc-900 !px-4 lg:!px-[7%] gap-8">
        <div className="col-span-1 lg:col-span-5">
          <h1 className="text-4xl lg:text-6xl font-semibold !mb-6">
            {product?.data?.user?.full_name || "Brand"}
          </h1>
          <div className="text-2xl font-bold !mb-4">
            {formatPrice()}
          </div>
          <p className="text-muted-foreground !mb-8">
            {product.product_description || "Premium product with excellent features."}
          </p>
          <div className="w-full lg:w-2/3">
            <Accordion type="single" collapsible>
              {getAccordionData().map((item) => (
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
          {product?.data?.related_products?.slice(0, 4).map((relatedProduct: any) => (
            <Link href={`/brands/brand/product/${relatedProduct.id}`} key={relatedProduct.id}>
              <ProductCard
                data={{
                  image: relatedProduct.product_image || "/image/shop/item.jpg",
                  title: relatedProduct.product_name,
                  category: relatedProduct.category?.name || "Product",
                  note: `$${parseFloat(relatedProduct.product_price).toFixed(2)}`,
                  discount: relatedProduct.product_discount,
                  hearts: relatedProduct.total_heart,
                  rating: parseFloat(relatedProduct.average_rating || "0").toFixed(1)
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}