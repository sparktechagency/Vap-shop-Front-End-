/* eslint-disable @typescript-eslint/no-unused-vars */
import ForumCard from "@/components/core/forum-card";
import LoadingScletion from "@/components/LoadingScletion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { AlertTriangle, PaintbrushIcon } from "lucide-react";
import React from "react";

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
  console.log("id", id);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(8);
  const { data, isLoading } = useGetallThredsByGropIdQuery({
    id: JSON.parse(id),
    page,
    per_page: perPage,
  });

  console.log("data", data);
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

  return (
    <div className="!space-y-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PaintbrushIcon /> Post a thread
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle></DialogTitle>
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

        {data ? (
          data?.data?.data?.map((thread: Thread) => (
            <ForumCard
              key={thread.id}
              data={transformThreadToCardData(thread)}
              to={`/forum/thread/post/${thread.id}`}
            />
          ))
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alert!</AlertTitle>
            <AlertDescription>Data not found</AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Add pagination controls if needed */}
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
