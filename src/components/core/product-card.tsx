import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductType } from "@/lib/types/product";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import Link from "next/link";

export default function ProductCard({
  data,
  manage,
}: {
  data: ProductType;
  manage?: boolean;
}) {
  return (
    <Card className="!p-0 !gap-0 shadow-sm">
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-t-lg relative"
        style={{ backgroundImage: `url('${data.image}')` }}
      >
        {data.type === "ad" && (
          <div className="absolute top-4 left-4 text-2xl md:text-4xl">🔥</div>
        )}
        <div className="absolute bottom-2 right-2 flex z-50">
          <Button
            className="!text-sm"
            variant="outline"
          // size="icon"
          >
            {data?.hearts || 0}
            <HeartIcon className="!text-4xl size-5" />
          </Button>
        </div>
      </div>
      <CardContent className="!p-4 !space-y-1">
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
      {manage && (
        <CardFooter className="p-4! grid grid-cols-2 gap-4">
          <Button variant="special" asChild>
            <Link href="/me/manage/ad-request">Ad request</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/brands/brand/product">View</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
