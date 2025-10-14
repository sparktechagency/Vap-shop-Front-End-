/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import ArticleCard from "@/components/core/article-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetMostratedArticalQuery } from "@/redux/features/Trending/TrendingApi";
import {
  useCountysQuery,
  useGetOwnprofileQuery,
} from "@/redux/features/AuthApi";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDownIcon, ChevronLeft, Globe } from "lucide-react";

export default function Featured() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [region, setRegion] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState<any>(null);
  const [open, setOpen] = React.useState(false);

  const { data, isLoading, isError, error }: any = useGetMostratedArticalQuery({
    page: currentPage.toString(),
    per_page: "16",
    region,
  });

  const { data: user } = useGetOwnprofileQuery();
  const { data: countries, isLoading: cLoading } = useCountysQuery();

  const totalPages = data?.data?.last_page || 1;
  const visiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage + 1 < visiblePages) {
    if (currentPage < totalPages / 2) {
      endPage = Math.min(totalPages, startPage + visiblePages - 1);
    } else {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectRegion = (val: string) => {
    setRegion(val);
    setCurrentPage(1);
    setOpen(false);
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="!my-12 grid grid-cols-1 md:flex justify-between items-center gap-4">
        <div className="md:flex gap-4 w-full grid">
          {user?.data?.role !== 6 && (
            <>
              <Button variant="special" asChild>
                <Link href="trending/my-articles/post">Post an Article</Link>
              </Button>
              <Button asChild>
                <Link href="trending/my-articles">My Articles</Link>
              </Button>
            </>
          )}
        </div>

        {!cLoading && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-[180px] justify-between transition"
              >
                {region === ""
                  ? "Worldwide"
                  : (() => {
                      const country = countries?.data?.find((c: any) =>
                        c.regions.some((r: any) => r.id.toString() === region)
                      );
                      const regionData = country?.regions?.find(
                        (r: any) => r.id.toString() === region
                      );
                      return regionData
                        ? `${regionData.name} (${regionData.code})`
                        : "Select Region";
                    })()}
                <ChevronDownIcon
                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[340px]! p-2" align="end">
              {selectedCountry ? (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCountry(null)}
                    className="text-muted-foreground flex items-center gap-1 mb-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  {selectedCountry.regions.map((r: any) => (
                    <Button
                      key={r.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSelectRegion(r.id.toString())}
                    >
                      {r.name} ({r.code})
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectRegion("")}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Globe className="w-4 h-4" /> Worldwide
                  </Button>

                  {countries?.data?.map((c: any) => (
                    <Button
                      key={c.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCountry(c)}
                    >
                      {c.name}
                    </Button>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>

      <h2 className="text-3xl text-center">🔥 Featured Articles</h2>

      {isError ? (
        <div className="py-4 text-center text-red-600">
          {error?.data?.message || "Failed to load articles."}
        </div>
      ) : data?.data?.data?.length > 0 ? (
        <div className="!my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.data.data.map((article: any) => (
            <ArticleCard
              key={article?.id}
              article={{
                id: article?.id,
                title: article?.title,
                content: article?.content,
                image: article?.article_image || "/image/trends.jpg",
                likeCount: article?.like_count,
                isLiked: article?.is_post_liked,
                role: article?.role,
                createdAt: article?.created_at,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-center my-12 text-gray-500">No articles found.</p>
      )}

      {/* Pagination Controls */}
      {!isError && data?.data?.data?.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  isActive={currentPage > 1}
                />
              </PaginationItem>

              {startPage > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(1)}
                      isActive={1 === currentPage}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {startPage > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      isActive={totalPages === currentPage}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  isActive={currentPage < totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="!my-12 grid grid-cols-1 md:flex justify-between items-center gap-4">
      <div className="md:flex gap-4 w-full grid">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full md:w-[180px]" />
    </div>

    <Skeleton className="h-10 w-64 mb-12" />

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
      ))}
    </div>
  </div>
);
