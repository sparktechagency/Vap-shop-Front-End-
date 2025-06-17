import { Badge } from "@/components/ui/badge";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";

interface ForumCardType {
  title: string;
  date: string;
  secondaryA: string;
  secondaryB: string;
  new?: boolean;
}

export default function ForumCard({
  data,
  to,
}: {
  data: ForumCardType;
  to?: string;
}) {
  return (
    <Link href={to ? to : "#"}>
      <div className="w-full flex flex-row justify-between items-center !py-2 lg:!py-6 cursor-pointer hover:bg-secondary lg:rounded-xl lg:hover:border dark:hover:bg-background lg:hover:scale-[103%] transition-all">
        <div className="min-h-[5rem] md:h-24 !px-3 sm:!px-6 flex gap-2 sm:gap-4 w-full">
          <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-full md:aspect-square border rounded-xl bg-secondary flex justify-center items-center shrink-0">
            <MessagesSquareIcon className="size-6 sm:size-8 md:size-10 text-muted-foreground" />
          </div>
          <div className="flex flex-col justify-between !py-0 md:!py-1 w-full">
            <div className="flex flex-col lg:flex-row gap-1 md:gap-3 items-start lg:items-center">
              <h2 className="text-xs md:text-sm lg:text-xl line-clamp-2 lg:line-clamp-1">
                {data.title}
              </h2>
              {data.new && (
                <Badge className="text-xs whitespace-nowrap">New!</Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 sm:mt-0">
              <div className="text-xs md:text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-4">
                <p>{data.secondaryA}</p>
                <p className="hidden sm:block">{data.secondaryB}</p>
              </div>
              <div className="text-muted-foreground text-xs md:text-sm mt-1 sm:mt-0">
                {data.date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
