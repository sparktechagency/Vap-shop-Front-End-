/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductType } from "@/lib/types/product";
import { Button } from "../ui/button";
import {
  CopyIcon,
  Edit2Icon,
  EllipsisVerticalIcon,
  HeartIcon,
  MailIcon,
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
export default function ProductCard({
  refetchAds,
  refetch,
  data,
  manage,
  link,
}: {
  refetchAds?: () => void;
  refetch?: () => void;
  data: ProductType;
  manage?: boolean;
  link?: string;
}) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const [fevoriteUnveforite] = useFevoriteUnveforiteMutation();
  const [deleteProd, { isLoading }] = useDeleteProdMutation();
  const handleFebandUnfev = async (id: number) => {
    console.log("id", id);
    const alldata = {
      product_id: id,
      role: 3,
    };
    console.log("alldata", alldata);
    try {
      const response = await fevoriteUnveforite(alldata).unwrap();
      if (response.ok) {
        refetchAds && refetchAds();
        refetch && refetch();
        toast.success(response.message || "Fevorited successfully");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to fevorite");
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

  return (
    <Card className="!p-0 !gap-0 shadow-sm overflow-hidden group relative">
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-t-lg relative transition-transform duration-300"
        style={{ backgroundImage: `url('${data.image}')` }}
      >
        {data.type === "ad" && (
          <div className="absolute top-4 left-4 text-2xl md:text-4xl">🔥</div>
        )}
        {!manage && (
          <div className="absolute bottom-2 right-2 flex z-50">
            <Button
              className="!text-sm"
              variant="outline"
              onClick={(e) => handleFebandUnfev(data?.id as number)}
            >
              {data?.hearts || 0}
              <HeartIcon
                className={`ml-1 size-5 ${
                  data?.is_hearted ? "text-red-500 fill-red-500" : ""
                }`}
              />
            </Button>
          </div>
        )}
        {manage && (
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/me/manage/${data.id}`}>
                    <Edit2Icon />
                    Edit
                  </Link>
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      variant="destructive"
                    >
                      <Trash2Icon />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive/60!"
                        onClick={async () => {
                          deleteProd({ id: data.id });
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full cursor-pointer">
                        <Share2Icon />
                        Share
                      </button>
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
                        title={data?.title || "Check out this product"}
                      />
                    </DialogContent>
                  </Dialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* 🔹 Content - click to navigate */}
      <Link href={link ? link : "#"}>
        <div className="cursor-pointer">
          <CardContent className="!p-4 !space-y-1 transition-colors hover:text-primary">
            {data?.category !== null && (
              <p className="text-muted-foreground font-bold text-sm md:text-base">
                ${data?.category}
              </p>
            )}
            <h3 className="lg:text-base font-semibold text-xs md:text-sm">
              {data.title}
            </h3>
            <div className="text-xs md:text-sm text-muted-foreground">
              <span>{data.note}</span>
            </div>
          </CardContent>
        </div>
      </Link>

      {/* 🔹 Manage buttons */}
      {manage && (
        <CardFooter className="!p-4 grid grid-cols-2 gap-4">
          <Button
            variant="special"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/me/manage/ad-request">Ad request</Link>
          </Button>
          {link && (
            <Button
              variant="outline"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Link href={link}>View</Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
}
const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  return (
    <div className="flex justify-center gap-4 pt-4">
      <FacebookShareButton url={url} hashtag="#vapeshopmaps">
        <Button variant="outline" size="icon" asChild>
          <FaFacebook className="h-5 w-5 text-blue-600" />
        </Button>
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <Button variant="outline" size="icon" asChild>
          <FaTwitter className="h-5 w-5 text-blue-400" />
        </Button>
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title}>
        <Button variant="outline" size="icon" asChild>
          <FaLinkedin className="h-5 w-5 text-blue-700" />
        </Button>
      </LinkedinShareButton>
      <EmailShareButton url={url} subject={title}>
        <Button variant="outline" size="icon" asChild>
          <MailIcon className="h-5 w-5 text-gray-600" />
        </Button>
      </EmailShareButton>
    </div>
  );
};
