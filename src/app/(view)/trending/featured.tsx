/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ArticleCard from "@/components/core/article-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetMostratedArticalQuery } from "@/redux/features/Trending/TrendingApi";
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
import {
  useCountysQuery,
  useGetOwnprofileQuery,
} from "@/redux/features/AuthApi";

export default function Featured() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [region, setRegion] = React.useState<string>("");

  // Destructure error info from query
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
          <Select
            onValueChange={(val) => {
              setRegion(val.trim());
              setCurrentPage(1);
            }}
            value={region || " "}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Worldwide</SelectItem>
              <SelectSeparator />

              {countries?.data?.map((x: any, i: number) => (
                <React.Fragment key={`country-${x.id}`}>
                  <SelectGroup key={`group-${x.id}`}>
                    <SelectLabel>{x.name}</SelectLabel>
                    {x.regions.map((y: any) => (
                      <SelectItem
                        value={y.id.toString()}
                        key={`region-${y.id}`}
                      >
                        {y.name} ({y.code})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {countries?.data?.length !== i + 1 && <SelectSeparator />}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <h2 className="text-3xl">🔥 Featured Articles</h2>

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
