/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useGetNotifsQuery,
  useReadNotifAllMutation,
  useReadNotifMutation,
} from "@/redux/features/notification/notifApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Bell,
  Package,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

interface NotificationData {
  id: string;
  type: string;
  data: {
    message: string;
    link?: string;
    time?: string;
    status?: string;
    customer_name?: string;
    product_name?: string;
    order_id?: number;
  };
  read_at: string | null;
  created_at: string;
}

interface NotificationResponse {
  current_page: number;
  data: NotificationData[];
  last_page: number;
  total: number;
  per_page: number;
}

const getNotificationIcon = (type: string, status?: string) => {
  switch (type) {
    case "App\\Notifications\\MostFollowersRequestConfirmation":
      return <TrendingUp className="h-5 w-5 text-blue-500" />;
    case "App\\Notifications\\TrendingRequestConfirmation":
      return <TrendingUp className="h-5 w-5 text-purple-500" />;
    case "App\\Notifications\\NewOrderRequestNotification":
      return <ShoppingCart className="h-5 w-5 text-green-500" />;
    case "App\\Notifications\\OrderStatusUpdatedNotification":
      if (status === "accepted") {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      } else if (status === "rejected") {
        return <XCircle className="h-5 w-5 text-red-500" />;
      }
      return <Package className="h-5 w-5 text-orange-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getNotificationTitle = (type: string) => {
  switch (type) {
    case "App\\Notifications\\MostFollowersRequestConfirmation":
      return "Most Followers Ad Request";
    case "App\\Notifications\\TrendingRequestConfirmation":
      return "Trending Request";
    case "App\\Notifications\\NewOrderRequestNotification":
      return "New Order Request";
    case "App\\Notifications\\OrderStatusUpdatedNotification":
      return "Order Status Update";
    default:
      return "Notification";
  }
};

const formatTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return "Unknown time";
  }
};

export default function Notifications() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useGetNotifsQuery({
    page: currentPage,
  }) as {
    data: NotificationResponse;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  const [readNotif] = useReadNotifMutation();
  const [readAll] = useReadNotifAllMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold">Something went wrong</h3>
        <p className="text-muted-foreground">Unable to load notifications</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const notifications = data?.data || [];
  const totalPages = data?.last_page || 1;
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-6 p-6 w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "All caught up!"}
          </p>
        </div>
        <div className="space-x-4">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              {unreadCount} unread
            </Badge>
          )}
          <Button
            onClick={async () => {
              try {
                const res = await readAll().unwrap();
                if (!res.ok) {
                  toast.error(res.message ?? "Failed to mark all as read");
                } else {
                  toast.success(res.message ?? "Marked All as read");
                }
              } catch (error) {
                console.error(error);
                toast.error("Something went wrong");
              }
            }}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground text-center">
                {
                  "You're all caught up! Check back later for new notifications."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const isUnread = !notification.read_at;
            const notificationStatus = notification.data.message.includes(
              "accepted"
            )
              ? "accepted"
              : notification.data.message.includes("rejected")
              ? "rejected"
              : notification.data.status;

            return (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  isUnread ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(
                        notification.type,
                        notificationStatus
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium">
                          {getNotificationTitle(notification.type)}
                        </h4>
                        {isUnread && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-2">
                        {notification.data.message}
                      </p>

                      {/* Additional Info */}
                      {notification.data.customer_name && (
                        <p className="text-xs text-muted-foreground">
                          Customer: {notification.data.customer_name}
                        </p>
                      )}

                      {notification.data.product_name && (
                        <p className="text-xs text-muted-foreground">
                          Product: {notification.data.product_name}
                        </p>
                      )}

                      <div className="space-x-2 mt-6">
                        {!notification.read_at && (
                          <Button
                            variant="default"
                            onClick={async () => {
                              try {
                                const res = await readNotif({
                                  id: notification.id,
                                }).unwrap();
                                if (!res.ok) {
                                  toast.error(
                                    res.message ?? "Failed to read notification"
                                  );
                                } else {
                                  toast.success(
                                    res.message ?? "Marked as read."
                                  );
                                }
                              } catch (error) {
                                console.error(error);
                                toast.error("Something went wrong");
                              }
                            }}
                          >
                            Mark as read
                          </Button>
                        )}
                        {/* Action Button */}
                        {notification.data.link && (
                          <Button
                            variant="outline"
                            className="mt-2 bg-transparent"
                            asChild
                          >
                            <Link href={"/me/orders"}>View Details</Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                      {notification.data.status && (
                        <Badge
                          variant={
                            notification.data.status === "pending"
                              ? "secondary"
                              : notificationStatus === "accepted"
                              ? "default"
                              : "destructive"
                          }
                          className="mt-1 text-xs"
                        >
                          {notification.data.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {notifications.length} of {data?.total || 0} notifications
      </div>
    </div>
  );
}
