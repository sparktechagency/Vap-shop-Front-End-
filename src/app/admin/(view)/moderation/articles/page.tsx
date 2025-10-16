"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useDelteAricalMutation,
  useGetallArticlesQuery,
} from "@/redux/features/admin/AdminApis";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Article {
  id: number;
  user_id: number;
  title: string;
  content: string;
  article_image: string | null;
  content_type: string;
  created_at: string;
  updated_at: string;
  role: string;
  like_count: number;
}

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);
  const per_page = 6;
  const [currentlyDeleting, setCurrentlyDeleting] = useState<number | null>(
    null
  );

  const { data, isLoading, isError, error, refetch } = useGetallArticlesQuery({
    page,
    per_page,
    search: searchTerm,
  });

  const [deleteArticle] = useDelteAricalMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchAttempted(true);
  };

  const handleDelete = async (id: number) => {
    setCurrentlyDeleting(id);
    try {
      const response = await deleteArticle({ id }).unwrap();
      if (response?.ok) {
        toast.success("Article deleted successfully");
        refetch();
      } else {
        toast.error(response?.message || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setCurrentlyDeleting(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.data?.last_page || 1)) {
      setPage(newPage);
    }
  };

  const renderPaginationItems = () => {
    if (!data?.data?.links || data?.data?.data?.length === 0) return null;

    return data.data.links.map((link: any, index: number) => {
      if (link.label === "&laquo; Previous") {
        return (
          <PaginationItem key={index}>
            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
          </PaginationItem>
        );
      }

      if (link.label === "Next &raquo;") {
        return (
          <PaginationItem key={index}>
            <PaginationNext onClick={() => handlePageChange(page + 1)} />
          </PaginationItem>
        );
      }

      if (link.url === null) return null;

      const pageNumber = parseInt(link.label);
      return (
        <PaginationItem key={index}>
          <PaginationLink
            isActive={link.active}
            onClick={() => handlePageChange(pageNumber)}
          >
            {link.label}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="h-full w-full !p-6">
        <div className="grid grid-cols-2 w-full">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <div className="flex flex-row justify-end items-center">
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        <div className="grid grid-cols-3 !py-12 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card className="!pt-0 overflow-hidden" key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full !p-6">
      <div className="grid lg:grid-cols-2 w-full space-y-6">
        <div className="flex gap-4">
          <Input
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Select>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="content">Content</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {data?.data?.data?.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full py-12">
          <p className="text-2xl font-bold">
            {searchAttempted
              ? "No articles found matching your search"
              : "No articles available"}
          </p>
          {searchAttempted && (
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSearchAttempted(false);
                setPage(1);
              }}
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 !py-12 gap-6">
            {data?.data?.data?.map((article: Article) => (
              <Card className="!pt-0 overflow-hidden" key={article.id}>
                <Image
                  src={article.article_image || "/image/trends.jpg"}
                  height={1920}
                  width={1280}
                  alt={article.title}
                  className="aspect-video object-cover hover:scale-105 hover:opacity-80 transition-all"
                />
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription className="line-clamp-4">
                    {article.content}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <Link href={`/trending/article/${article.id}`}>
                    <button className="w-full !py-4 rounded-lg outline-2 flex justify-center items-center cursor-pointer hover:bg-secondary transition-colors">
                      View Article
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-destructive w-full !py-4 rounded-lg outline-0 dark:outline-2 flex justify-center items-center text-background dark:text-foreground dark:bg-secondary cursor-pointer dark:hover:!bg-card"
                    disabled={currentlyDeleting === article.id}
                  >
                    <Trash2Icon className="!mr-2" />
                    {currentlyDeleting === article.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Pagination - Only show if there are items */}
          {data?.data?.data?.length > 0 && (
            <div className="w-full flex justify-center mt-4">
              <Pagination>
                <PaginationContent>{renderPaginationItems()}</PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
