"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductType } from "@/lib/types/product";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { useFevoriteUnveforiteMutation } from "@/redux/features/Trending/TrendingApi";
import { toast } from "sonner";

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
  const [fevoriteUnveforite, { isLoading }] = useFevoriteUnveforiteMutation()

  const handleFebandUnfev = async (id: number) => {
    console.log('id', id);
    const alldata = {
      product_id: id,
      role: 3,
    }
    console.log('alldata', alldata);
    try {
      const response = await fevoriteUnveforite(alldata).unwrap();
      if (response.ok) {
        refetchAds && refetchAds();
        refetch && refetch();
        toast.success(response.message || "Fevorited successfully");
      }
    } catch (error) {
      console.log('error', error);
      toast.error(error?.data?.message || "Failed to fevorite");
    }
  }


  console.log('singleproductdata', data);
  return (
    <Card className="!p-0 !gap-0 shadow-sm overflow-hidden group">
      {/* 🔹 Image - no click */}
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
                className={`ml-1 size-5 ${data?.is_hearted ? "text-red-500 fill-red-500" : ""}`}
              />

            </Button>

          </div>
        )}
      </div>

      {/* 🔹 Content - click to navigate */}
      <Link href={link ? link : "#"}>
        <div className="cursor-pointer">
          <CardContent className="!p-4 !space-y-1 transition-colors hover:text-primary">
            <p className="text-muted-foreground font-bold text-sm md:text-base">
              {data.category}
            </p>
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
