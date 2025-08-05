import { Badge } from "@/components/ui/badge";
import { EditIcon, MessagesSquareIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useDeleteThreadMutation } from "@/redux/features/Forum/ForumApi";
// Interface for the forum group data structure
interface ForumGroupType {
  id?: number;
  title?: string;
  description?: string;
  user_id?: number | string;
  type?: string;
  created_at?: string;
  updated_at?: string;
  threads_count?: number | string;
  total_threads?: number | string;
  total_comments?: number | string;
  date?: string | null;
}

// Interface for the component's props
interface ForumCardProps {
  data?: ForumGroupType;
  to?: string;
  editable?: boolean;
  refetch?: () => void;
}

export default function ForumCard({
  refetch,
  data,
  to,
  editable,
}: ForumCardProps) {
  // Safely access data with a fallback to an empty object to prevent errors
  const safeData = data || {};

  // Format the creation date for display, with a fallback for missing dates
  const formattedDate = safeData.created_at
    ? new Date(safeData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  // Redux hooks for deleting a group and fetching user profile
  const [deleteGroup, { isLoading }] = useDeleteThreadMutation();
  const { data: user } = useGetOwnprofileQuery();
  const token = Cookies.get("token");
  console.log("user", user?.data?.role);

  // Determine if the group is new (created within the last 7 days)
  const isNew = safeData.created_at
    ? new Date().getTime() - new Date(safeData.created_at).getTime() <
      7 * 24 * 60 * 60 * 1000
    : false;

  // --- START: URL Construction Logic ---
  // 1. Define the base URL. Use the 'to' prop if it exists, otherwise use the default path.
  const baseUrl = to || `/forum/thread/${safeData.id}`;

  // 2. Serialize the data object and encode it to be URL-safe.
  // This prevents errors from special characters like '{', '}', '"', etc.
  const serializedData = encodeURIComponent(JSON.stringify(safeData));

  // 3. Determine the correct separator. If the baseUrl already has a query string,
  // use '&' to append the new parameter. Otherwise, use '?'.
  const separator = baseUrl.includes("?") ? "&" : "?";

  // 4. Construct the final, complete URL.
  const finalUrl = `${baseUrl}${separator}data=${serializedData}`;
  // --- END: URL Construction Logic ---

  // Function to handle the deletion of a group
  const handleDeleteGroup = async (id?: number) => {
    if (!id) return;

    // Use a custom modal/toast for confirmation instead of window.confirm in real apps
    const confirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );
    if (!confirmed) return;

    try {
      await deleteGroup({ id }).unwrap();
      toast.success("Group deleted successfully");
      refetch?.();
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast.error("Failed to delete group");
    }
  };

  // Display a loading skeleton if the data is not yet available
  if (!safeData.id) {
    return <ForumCardSkeleton />;
  }

  return (
    <div className="w-full flex flex-row justify-between items-center !py-2 lg:!py-6 cursor-pointer hover:bg-secondary/80 lg:rounded-xl lg:hover:border dark:hover:bg-background/30 lg:hover:scale-[102%] transition-all">
      <div className="min-h-[5rem] h-full !px-3 sm:!px-6 flex gap-2 sm:gap-4 w-full">
        {/* Icon */}
        <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-full md:aspect-square border rounded-xl bg-secondary flex justify-center items-center shrink-0">
          <MessagesSquareIcon className="size-6 sm:size-8 md:size-10 text-muted-foreground" />
        </div>

        {/* Use the final, correctly constructed URL in the Link component */}
        <Link href={finalUrl} className="w-full h-full mb-0! p-0!">
          <div className="flex flex-col justify-between !py-0 md:!py-1 w-full">
            <div className="flex flex-col lg:flex-row gap-1 md:gap-3 items-start lg:items-center">
              <h2 className="text-xs md:text-sm lg:text-xl line-clamp-2 lg:line-clamp-1">
                {safeData.title || "Untitled Forum"}
              </h2>
              {isNew && (
                <Badge className="text-xs whitespace-nowrap">New!</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {safeData.description || "No description available"}
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 sm:mt-0">
              <div className="text-xs md:text-sm text-muted-foreground flex gap-4">
                <p>{safeData.total_threads || 0} Threads</p>
                <p>{safeData.total_comments || 0} Comments</p>
              </div>
              <div className="text-muted-foreground text-xs md:text-sm mt-1 sm:mt-0">
                Created: {formattedDate}
              </div>
            </div>
          </div>
        </Link>

        {/* Editable controls for group owner */}
        {editable && (
          <div className="h-full flex items-center justify-center gap-2 pl-6">
            <Button variant="outline" asChild>
              <Link href={`/me/manage-group?id=${safeData.id}`}>
                <EditIcon className="mr-2" /> Manage Group
              </Link>
            </Button>
            <Button
              onClick={() => handleDeleteGroup(safeData.id)}
              variant="destructive"
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        )}

        {/* Delete control for admin */}
        {token && user?.data?.role === 1 && (
          <div className="h-full flex items-center justify-center pl-6">
            <Button
              onClick={() => handleDeleteGroup(safeData.id)}
              variant="destructive"
              size="icon"
              disabled={isLoading}
            >
              <Trash2Icon />
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
