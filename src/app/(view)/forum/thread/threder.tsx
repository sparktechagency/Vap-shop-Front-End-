"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import ForumCard from "@/components/core/forum-card";
import LoadingScletion from "@/components/LoadingScletion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetallThredsByGropIdQuery } from "@/redux/features/Forum/ForumApi";
import { PaintbrushIcon, MessageSquare, Users } from "lucide-react";
import React from "react";
import PostCreate from "./post-create";

// Define the type for your thread data based on the API response
interface Thread {
  id: number;
  title: string;
  views: number;
  created_at: string;
  total_replies: number;
  user: {
    full_name: string;
  };
}

// Define the type for the API response
// interface ThreadsResponse {
//   ok: boolean;
//   message: string;
//   data: {
//     current_page: number;
//     data: Thread[];
//     per_page: number;
//     total: number;
//   };
// }

export default function Threader({ id }: { id: string }) {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(8);
  const { data, isLoading } = useGetallThredsByGropIdQuery({
    id: JSON.parse(id),
    page,
    per_page: perPage,
  });


  console.log('data', data);
  console.log('id', id);


  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (isLoading) {
    return <LoadingScletion />;
  }

  // Transform API data to match ForumCardType
  const transformThreadToCardData = (thread: Thread): ForumCardType => ({
    title: thread.title,
    date: new Date(thread.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    secondaryA: `Replies: ${thread.total_replies}`,
    secondaryB: `Views: ${thread.views}`,
    new: false, // You can add logic to determine if a thread is new
  });

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16! px-6! text-center">
      <div className="relative mb-6!">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4 text-primary" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2!">
        No threads yet
      </h3>

      <p className="text-muted-foreground mb-6! max-w-md">
        This forum is waiting for its first discussion. Be the pioneer and start
        a conversation that others can join!
      </p>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <PaintbrushIcon className="w-4 h-4" />
            Start the first thread
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[80dvw]! min-h-fit flex flex-col">
          <DialogHeader className="border-b pb-4!">
            <DialogTitle className="text-sm!">Post a new thread</DialogTitle>
          </DialogHeader>
          <PostCreate id={id} closer={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="mt-8! text-xs text-muted-foreground">
        💡 Tip: Great discussions start with engaging questions or interesting
        topics
      </div>
    </div>
  );

  return (
    <div className="!space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PaintbrushIcon /> Post a thread
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[80dvw]! min-h-fit flex flex-col">
            <DialogHeader className="border-b pb-6!">
              <DialogTitle className="text-sm!">Post a new thread</DialogTitle>
            </DialogHeader>
            <PostCreate id={id} closer={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card className="gap-0 !pt-0">
        <CardHeader className="flex justify-end items-center bg-secondary !p-6">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" className="bg-background" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="light">Most Recent</SelectItem>
              <SelectItem value="dark">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        {data && data?.data?.data?.length > 0 ? (
          data?.data?.data?.map((thread: Thread) => (
            <ForumCard
              key={thread.id}
              data={{
                id: thread.id,
                title: thread.title,
                created_at: thread.created_at,

                threads_count: thread.total_replies,
                total_threads: thread.total_replies,
                total_comments: thread.total_replies,
              }}
              to={`/forum/thread/post/${thread.id}`}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </Card>

      {/* Add pagination controls if needed */}
      {data && data?.data?.data?.length > 0 && (
        <div className="flex justify-between items-center">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>
          <span>
            Page {page} of {data?.data.last_page}
          </span>
          <Button
            disabled={page >= (data?.data.last_page || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// Add this interface if not already defined in your ForumCard component
interface ForumCardType {
  title: string;
  date: string;
  secondaryA: string;
  secondaryB: string;
  new?: boolean;
}
