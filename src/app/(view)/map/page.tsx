import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { InfoIcon, TagIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  return (
    <main className="!my-12 !px-4 lg:!px-[7%]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Map</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="!my-12">
        <h1 className="font-semibold text-4xl">
          Vape Shop in <span className="font-normal">Murfreesboro, TN</span>
        </h1>
      </div>

      <div className="!my-12 grid grid-cols-2 md:flex flex-row justify-start items-center gap-4">
        <Button className="rounded-full">Open now</Button>
        <Button className="rounded-full bg-purple-800 dark:bg-primary hover:!bg-primary/80 dark:!text-foreground">
          Storefronts
        </Button>
        <Button className="rounded-full">Delivery</Button>
        <Button className="rounded-full">Order online</Button>
        <Button className="rounded-full flex items-center">
          <TagIcon /> Deals
        </Button>
        <Button className="rounded-full">Best of Vapeshopmaps</Button>
        <Button className="rounded-full">Disposable</Button>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-5 !space-y-6">
        <div className="relative h-[80dvh] w-full border bg-secondary rounded-md overflow-hidden flex flex-col justify-between items-center z-30">
          <div className="h-[48px] w-full bg-primary flex justify-between items-center !px-4">
            <div className="flex items-center gap-2 text-xs text-background font-semibold">
              Showing result 1-30 <InfoIcon className="!ml-1 size-3" />
            </div>
            <div className="">
              <Select>
                <SelectTrigger className="w-min text-background border-0">
                  <SelectValue
                    placeholder="Sort by"
                    className="bg-background"
                  />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="light">Most Recent</SelectItem>
                  <SelectItem value="dark">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 w-full overflow-y-scroll !p-4 !space-y-6">
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
            <div className=" h-[100px] w-full bg-background"></div>
          </div>
        </div>
        <iframe
          width="1200"
          height="650"
          loading="lazy"
          className="border-0 w-full h-[80dvh] col-span-2 rounded-lg"
          src="https://www.google.com/maps/embed/v1/search?q=Murfreesboro&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
        ></iframe>
      </div>
    </main>
  );
}
