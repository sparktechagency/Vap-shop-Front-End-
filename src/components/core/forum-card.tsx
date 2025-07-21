/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { EditIcon, MessagesSquareIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";

interface ForumGroupType {
  id: number;
  title: string;
  description: string;
  user_id: number | string;
  created_at: string;
  updated_at: string;
  threads_count: number | string;
  total_threads: number | string;
  total_comments: number | string;
  date: string | null;
}

interface ForumCardProps {
  data: ForumGroupType;
  to?: string;
  editable?: boolean;
}

export default function ForumCard({
  data,
  to,
  editable,
}: ForumCardProps | any) {
  // Format the date to be more readable
  const formattedDate = new Date(data?.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Determine if the group is new (created within the last 7 days)
  const isNew =
    new Date().getTime() - new Date(data?.created_at).getTime() <
    7 * 24 * 60 * 60 * 1000;

  return (
    <div className="w-full flex flex-row justify-between items-center !py-2 lg:!py-6 cursor-pointer hover:bg-secondary/80 lg:rounded-xl lg:hover:border dark:hover:bg-background/30 lg:hover:scale-[102%] transition-all">
      <div className="min-h-[5rem] h-full !px-3 sm:!px-6 flex gap-2 sm:gap-4 w-full">
        <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-full md:aspect-square border rounded-xl bg-secondary flex justify-center items-center shrink-0">
          <MessagesSquareIcon className="size-6 sm:size-8 md:size-10 text-muted-foreground" />
        </div>
        <Link
          href={to ? to : `/forum/thread/${data?.id}`}
          className="w-full h-full  mb-0! p-0!"
        >
          <div className="flex flex-col justify-between !py-0 md:!py-1 w-full">
            <div className="flex flex-col lg:flex-row gap-1 md:gap-3 items-start lg:items-center">
              <h2 className="text-xs md:text-sm lg:text-xl line-clamp-2 lg:line-clamp-1">
                {data?.title}
              </h2>
              {isNew && (
                <Badge className="text-xs whitespace-nowrap">New!</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {data?.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 sm:mt-0">
              <div className="text-xs md:text-sm text-muted-foreground flex gap-4">
                <p>{data?.total_threads} Threads</p>
                <p>{data?.total_comments} Comments</p>
              </div>
              <div className="text-muted-foreground text-xs md:text-sm mt-1 sm:mt-0">
                Created: {formattedDate}
              </div>
            </div>
          </div>
        </Link>
        {editable && (
          <div className="h-full flex items-center justify-center pl-6">
            <Button variant="outline" asChild>
              <Link href={`/me/manage-group?id=${data.id}`}>
                <EditIcon /> Manage Group
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton component
export function ForumCardSkeleton() {
  return (
    <div className="w-full flex flex-row justify-between items-center !py-2 lg:!py-6">
      <div className="min-h-[5rem] md:h-24 !px-3 sm:!px-6 flex gap-2 sm:gap-4 w-full">
        <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 md:h-24 md:w-24 rounded-xl shrink-0" />
        <div className="flex flex-col justify-between !py-0 md:!py-1 w-full gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
