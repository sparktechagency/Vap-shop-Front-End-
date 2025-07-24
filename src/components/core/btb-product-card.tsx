/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductType } from "@/lib/types/product";
import { Button } from "../ui/button";
import {
  ArrowUp01Icon,
  CopyIcon,
  Edit2Icon,
  EllipsisVerticalIcon,
  HeartIcon,
  MailIcon,
  PackagePlus,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useFevoriteUnveforiteMutation } from "@/redux/features/Trending/TrendingApi";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useDeleteProdMutation } from "@/redux/features/manage/product";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
export default function BtbProductCard({
  refetchAds,
  refetch,
  data,
  manage,
  link,
  role,
}: {
  refetchAds?: () => void;
  refetch?: () => void;
  data: ProductType;
  manage?: boolean;
  link?: string;
  role?: number;
}) {
  const [copied, setCopied] = useState(false);
  const currentUrl = `${
    window.location.origin ?? "https://vapeshopmaps.com/"
  }/stores/store/product/${data.id}`;
  const [deleteProd, { isLoading }] = useDeleteProdMutation();
  console.log(data);

  return (
    <Card className="!p-0 !gap-0 shadow-sm overflow-hidden group relative">
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-t-lg relative transition-transform duration-300"
        style={{ backgroundImage: `url('${data.image}')` }}
      >
        <div className="absolute bottom-2 right-2 flex z-50">
          <div className="rounded-full bg-background border border-black">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"ghost"} className="rounded-full gap-4">
                  <ArrowUp01Icon />
                  <PackagePlus />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" className="px-2!">
                <CardHeader className="px-2!">
                  <CardTitle>Add More</CardTitle>
                </CardHeader>
                <CardContent className="w-full grid grid-cols-3 gap-2 px-2! mt-3">
                  <Button className="flex-col h-auto!">
                    <span>+25</span>
                    <span>($409)</span>
                  </Button>
                  <Button className="flex-col h-auto!">
                    <span>+50</span>
                    <span>($1018)</span>
                  </Button>
                  <Button className="flex-col h-auto!">
                    <span>+100</span>
                    <span>($2026)</span>
                  </Button>
                </CardContent>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* 🔹 Content - click to navigate */}
      <Link href={link ? link : "#"}>
        <div className="cursor-pointer">
          <CardContent className="!p-4 !space-y-1 transition-colors hover:text-primary">
            {data?.category !== null && (
              <p className="text-muted-foreground font-bold text-sm md:text-base">
                {data?.category}
              </p>
            )}
            <h3 className="lg:text-base font-semibold text-xs md:text-sm">
              {data.title}
            </h3>
            {data.thc_percentage && (
              <div className="text-sm text-muted-foreground">
                {data?.thc_percentage}% THC
              </div>
            )}
            <div className="text-xs md:text-sm text-muted-foreground">
              <span>{data.note}</span>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
