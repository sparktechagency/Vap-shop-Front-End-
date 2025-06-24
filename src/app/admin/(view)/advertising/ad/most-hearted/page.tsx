import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useGetallAddRequestQuery } from "@/redux/features/admin/AdminApis";
export default function Page() {
  const [page, setPage] = React.useState(1);
  const per_page = 8;
  const { data, isLoading } = useGetallAddRequestQuery({
    page,
    per_page,
    type: "products",
  })

  console.log('data', data);

  return (
    <div className="h-full w-full flex flex-col justify-start items-baseline !p-12 gap-6">
      <div className="w-full grid grid-cols-2">
        <div className="flex gap-4">
          <Input placeholder="Search here" />
          <Button>Search</Button>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Name</SelectItem>
              <SelectItem value="dark">ID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h2 className="text-2xl font-bold">Most Hearted Products Ads</h2>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
          key={i}
        >
          <div
            className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
            style={{ backgroundImage: `url('/image/home/car1.png')` }}
          ></div>
          <div className="font-semibold">
            <Button variant="link" className="text-foreground" asChild>
              <Link href="/stores/store/product">
                Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)
              </Link>
            </Button>
          </div>
          <div className="text-sm font-semibold">Date: 23-04-2024</div>
          <Button variant="special">Approve</Button>
        </div>
      ))}
    </div>
  );
}
