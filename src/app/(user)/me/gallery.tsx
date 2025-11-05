"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IoCopySharp } from "react-icons/io5";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeartIcon } from "lucide-react";

export default function Gallery() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="w-full pt-2">
      <div className="grid grid-cols-4 gap-0 relative">
        {Array(16)
          .fill("")
          .map((_, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <Card
                  className="w-full relative aspect-[4/5] bg-cover rounded-none!"
                  style={{
                    backgroundImage: `url('https://picsum.photos/200')`,
                  }}
                >
                  <div className=" top-2 right-2 absolute z-20">
                    <div className="text-background p-2 rounded-lg bg-background/30">
                      <IoCopySharp className="size-5" />
                    </div>
                  </div>
                  <div className="h-full w-full absolute top-0 left-0 z-30 hover:bg-foreground/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"></div>
                </Card>
              </DialogTrigger>
              <DialogContent className="h-[90dvh] !min-w-fit px-[4%]! gap-0!">
                <DialogHeader className="hidden">
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="w-full flex justify-center items-center">
                  <Carousel className="w-[60dvh]" setApi={setApi}>
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-4xl font-semibold">
                                  {index + 1}
                                </span>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
                <div className="flex gap-2 mt-2 w-full justify-center items-center">
                  {Array.from({ length: count }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        current === index + 1
                          ? "bg-foreground w-4"
                          : "bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <DialogFooter className="mt-0 pt-0 flex justify-start! item-center">
                  <div className="w-full flex justify-start! item-center">
                    <Button variant={"special"}>
                      <HeartIcon /> 0
                    </Button>
                  </div>
                </DialogFooter>
                <div className="border-t">
                  <h4 className="text-muted-foreground text-sm font-semibold mt-4">
                    Post title goes here
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perspiciatis sunt perferendis, aspernatur eum hic omnis
                    rerum ea magni dolor laborum a facilis odio quas ratione
                    provident, exercitationem minus eos? Dolorem!
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          ))}

        {/* <div className="top-1/2 left-1/2 -translate-1/2 w-full h-full absolute flex justify-center items-center bg-background/20 backdrop-blur-sm">
          <div className="w-2/3 p-12 bg-foreground/10 rounded-sm border flex justify-center items-center">
            Under Development
          </div>
        </div> */}
      </div>
      <div className="w-full! flex justify-center items-center mt-12">
        <Pagination className="mx-auto w-fit! flex justify-center items-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
              // onClick={() => {
              //   if (page > 1) setPage(page - 1);
              // }}
              />
            </PaginationItem>

            {/* {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={page === pageNum}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })} */}
            <PaginationItem>
              <PaginationLink
              // isActive={page === pageNum}

              // onClick={() => setPage(pageNum)}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
              // isActive={page === pageNum}
              // onClick={() => setPage(pageNum)}
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
              // isActive={page === pageNum}
              // onClick={() => setPage(pageNum)}
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
              // onClick={() => {
              //   if (page < totalPages) setPage(page + 1);
              // }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
