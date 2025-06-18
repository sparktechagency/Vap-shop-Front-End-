import React from "react";

import ArticleCard from "@/components/core/article-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Featured() {
  return (
    <>
      <main className="!py-12 !px-2 md:!px-[7%]">
        <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
          MY ARTICLES
        </h1>
        <div className="flex gap-6 mt-12!">
          <Link href="post" className="w-full">
            <Input readOnly disabled />
          </Link>
          <Button variant="special" asChild>
            <Link href="my-articles/post">Post a new article</Link>
          </Button>
        </div>
        <div className="flex justify-center">
          <div className="!my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 50 }).map((_, i) => (
              <ArticleCard key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
