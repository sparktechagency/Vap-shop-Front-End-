import Namer from "@/components/core/internal/namer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowBigUpIcon } from "lucide-react";
import React from "react";

export default function Page() {
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
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          className="w-full rounded-2xl flex flex-row justify-between items-center border !p-4"
          key={i}
        >
          <div
            className="size-16 aspect-square bg-secondary rounded-lg bg-center bg-cover"
            style={{ backgroundImage: `url('/image/home/car1.png')` }}
          ></div>
          <div className="font-semibold">
            Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g (Reload)
          </div>
          <div className="text-sm font-semibold">Date: 23-04-2024</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>View Review</Button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle />
                <div className="flex flex-row justify-start items-center gap-3">
                  <Avatar className="!size-12">
                    <AvatarImage
                      src="/image/icon/brand.jpg"
                      className="object-cover"
                    />
                    <AvatarFallback>UI</AvatarFallback>
                  </Avatar>
                  <div className="">
                    <Namer name="NugNug" size="sm" type="brand" />
                    <p className="text-sm text-muted-foreground">
                      jaysmith@email.com
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="">
                <h3 className="font-bold !mb-3">
                  Blue Dream | Melted Diamond Live Resin Vaporizer | 1.0g
                  (Reload)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  mollis cursus eleifend. Aliquam quis maximus orci, at
                  venenatis turpis. Nulla accumsan tempor justo, sit amet ornare
                  erat elementum ac. Vestibulum ante ipsum primis in faucibus
                  orci luctus et ultrices posuere cubilia curae; Ut id purus nec
                  dui mattis tincidunt quis consectetur tellus. Etiam accumsan
                  tincidunt rhoncus. Fusce id risus a felis posuere ullamcorper
                  vel ut ipsum. Interdum et malesuada fames ac ante ipsum primis
                  in faucibus. Sed cursus consequat diam ultricies tempus. Morbi
                  sem quam, ullamcorper quis hendrerit ut, aliquam in ipsum.
                  Etiam faucibus sit amet elit quis hendrerit. Mauris iaculis
                  commodo malesuada. Etiam sed erat risus. Sed at neque congue,
                  finibus orci eu, hendrerit diam. Vestibulum ante ipsum primis
                  in faucibus orci luctus et ultrices posuere cubilia curae;
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                  Phasellus iaculis dignissim orci luctus tempus. Proin magna
                  lectus, gravida vulputate leo eu, pretium maximus mauris.
                  Praesent in ante quis lectus cursus interdum at et arcu. In
                  eleifend orci tempus semper mollis. Sed at eros at ante
                  tincidunt gravida. Sed nec finibus urna. Ut vel tortor in orci
                  porta molestie.
                </p>
                <div className="w-full !mt-6 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-1 font-semibold">
                    <ArrowBigUpIcon className="size-5" /> 11k
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">
                    Date Posted: 23-02-2025
                  </div>
                </div>
                <Button
                  className="w-full !border-2 !border-destructive !mt-6"
                  variant="outline"
                >
                  Delete Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
