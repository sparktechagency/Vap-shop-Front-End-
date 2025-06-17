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
const data = {
  image: "/image/shop/item.jpg",
  title: "Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)",
  category: "PODS",
  note: "93.1% THC",
};

const accordionData = [
  {
    id: "features",
    title: "Key Features",
    content:
      "Discover the standout features of the KUMIHO THOTH S, including its long-lasting 1000mAh battery, adjustable 5-35W wattage for a personalized vaping experience, and compatibility with a range of pod options. Experience consistent performance and ultimate control in the palm of your hand.",
  },
  {
    id: "specifications",
    title: "Technical Specifications",
    content: (
      <ul>
        <li>Battery Capacity: 1000mAh</li>
        <li>Wattage Range: 5 - 35W Adjustable</li>
        <li>Pod Compatibility: THOTH S Pod Series</li>
        <li>Charging: USB-C</li>
        <li>Display: LED Indicator</li>
        <li>Material: Durable Zinc Alloy</li>
      </ul>
    ),
  },
  {
    id: "what-in-the-box",
    title: "What's in the Box",
    content: (
      <ul>
        <li>1 x KUMIHO THOTH S Device</li>
        <li>1 x THOTH S Pod (0.8Ω Mesh Coil Pre-installed)</li>
        <li>1 x USB-C Cable</li>
        <li>1 x User Manual</li>
        <li>1 x Warranty Card</li>
      </ul>
    ),
  },
  {
    id: "how-to-use",
    title: "How to Use",
    content: (
      <ol>
        <li>
          <strong>Charging:</strong> Connect the device to a power source using
          the provided USB-C cable until fully charged. The LED indicator will
          show the charging status.
        </li>
        <li>
          <strong>Pod Installation:</strong> Insert a compatible THOTH S pod
          into the device until it clicks into place.
        </li>
        <li>
          <strong>Power On/Off:</strong> Quickly press the power button five
          times to turn the device on or off.
        </li>
        <li>
          <strong>Wattage Adjustment:</strong> Use the adjustment buttons to set
          your desired wattage (5-35W). The current wattage will be displayed on
          the LED indicator.
        </li>
        <li>
          <strong>Vaping:</strong> Once the pod is installed and the device is
          powered on, inhale through the mouthpiece to vape.
        </li>
      </ol>
    ),
  },
  {
    id: "safety-precautions",
    title: "Safety Precautions",
    content: (
      <ul>
        <li>Keep out of reach of children and pets.</li>
        <li>Do not use if the device or pod is damaged.</li>
        <li>Avoid extreme temperatures and direct sunlight.</li>
        <li>Use only compatible pods and charging cables.</li>
        <li>Dispose of responsibly according to local regulations.</li>
      </ul>
    ),
  },
];

export default function Page() {
  return (
    <main className="!py-12">
      <div className="!px-4 lg:!px-[7%] !pb-12">
        <div className="flex !py-4 gap-4 ">
          <Avatar className="size-24 border">
            <AvatarImage src="/image/icon/brand.jpg" alt="SMOK Brand Logo" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div className="h-24 flex flex-col !py-3 justify-center">
            <Namer name="SMOK" isVerified type="brand" size="xl" />
          </div>
          <div className="flex-1 h-24 flex flex-row justify-end items-center gap-4">
            <p className="font-semibold text-sm">43.1k followers</p>
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
            KUMIHO THOTH S Pod System
          </h1>
          <p className="text-muted-foreground !mb-8">
            The THOTH S pod system by kumiho, boasting a powerful 1000mAh
            battery and adjustable wattage from 5 to 35W, offers unmatched power
            and flexibility.
          </p>
          <div className="w-full lg:w-2/3">
            <Accordion type="single" collapsible>
              {accordionData.map((item) => (
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
            src="/image/shop/item.jpg"
            width={800}
            height={800}
            alt="KUMIHO THOTH S Pod System"
            className="aspect-square object-cover object-center w-full rounded-md shadow-lg"
          />
        </div>
      </div>
      <div className="!px-4 lg:!px-[7%] !py-20">
        <h3 className="text-2xl !mb-20">
          Looking more from{" "}
          <Link href="/brands/brand" className="underline font-semibold">
            SMOK
          </Link>
          ?
        </h3>
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Link href="/brands/brand/product" key={i}>
              <ProductCard data={data} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
