/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import ArticleCard from "@/components/core/article-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMyarticalQuery } from "@/redux/features/Trending/TrendingApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

export default function MyArticles() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useMyarticalQuery({
    page: currentPage.toString(),
    per_page: "10",
  });
  console.log("data", data);
  if (isLoading) return <LoadingSkeleton />;
  if (isError) {
    console.log(error, "error");
  }
  if (!data?.data?.data?.length)
    return (
      <div className="text-center py-12">
        <p>No articles found</p>
        <Button variant="special" className="mt-4" asChild>
          <Link href="my-articles/post">Post your first article</Link>
        </Button>
      </div>
    );

  const totalPages = data.data.last_page;
  const visiblePages = 5;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="!py-12 !px-2 md:!px-[7%]">
      <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
        MY ARTICLES
      </h1>

      <div className="flex gap-6 mt-12">
        <Input
          onClick={() => router.push("/trending/my-articles/post")}
          placeholder="Search your articles..."
          className="w-full"
          // Add search functionality here if needed
        />
        <Button variant="special" asChild>
          <Link href="my-articles/post">Post a new article</Link>
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="!my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.data.data.map((article: any) => (
            <ArticleCard
              refetch={refetch}
              key={article.id}
              article={{
                id: article.id,
                title: article.title,
                content: article.content,
                image: article.article_image || "/image/trends.jpg",
                likeCount: article.like_count,
                isLiked: article.is_post_liked,
                role: article.role,
                createdAt: article.created_at,
              }}
              me
            />
          ))}
         
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  isActive={currentPage > 1}
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(visiblePages, totalPages) },
                (_, i) => {
                  let pageNum;
                  if (currentPage <= Math.floor(visiblePages / 2)) {
                    pageNum = i + 1;
                  } else if (
                    currentPage >
                    totalPages - Math.floor(visiblePages / 2)
                  ) {
                    pageNum = totalPages - visiblePages + i + 1;
                  } else {
                    pageNum = currentPage - Math.floor(visiblePages / 2) + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
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
    </main>
  );
}

const LoadingSkeleton = () => (
  <main className="!py-12 !px-2 md:!px-[7%]">
    <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
      MY ARTICLES
    </h1>

    <div className="flex gap-6 mt-12">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-40 h-10" />
    </div>

    <div className="flex justify-center">
      <div className="!my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  </main>
);
