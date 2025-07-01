"use client";

import {
  BriefcaseBusinessIcon,
  Clock10Icon,
  MailWarningIcon,
  TrendingUpIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
} from "lucide-react";
import React from "react";
import { ChartAreaInteractive } from "./chart-area";
import { useGetAdminStatisticsQuery } from "@/redux/features/admin/AdminApis";
import { Skeleton } from "@/components/ui/skeleton";

const formatTime = (isoString: string) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function Page() {
  const { data: apiResponse, isLoading } = useGetAdminStatisticsQuery({
    period: "7d",
  });
  console.log('apiResponse', apiResponse);
  const stats = React.useMemo(() => {
    const data = apiResponse?.data;
    if (isLoading || !data) {
      return Array(5).fill({}).map((_, index) => ({
        title: <Skeleton className="h-4 w-24" key={`title-skel-${index}`} />,
        value: <Skeleton className="h-8 w-16" key={`val-skel-${index}`} />,
        change: <Skeleton className="h-4 w-20" key={`change-skel-${index}`} />,
        icon: BriefcaseBusinessIcon,
      }));
    }
    return [
      { title: "Total Users", value: data.Users.count, change: `${data.Users.percentage_change}%`, icon: UsersRoundIcon },
      { title: "Total Brands", value: data.totalBrands.count, change: `${data.totalBrands.percentage_change}%`, icon: BriefcaseBusinessIcon },
      { title: "Total Stores", value: data.totalStores.count, change: `${data.totalStores.percentage_change}%`, icon: BriefcaseBusinessIcon },
      { title: "Total Wholesalers", value: data.totalWholesalers.count, change: `${data.totalWholesalers.percentage_change}%`, icon: UserRoundPlusIcon },
      { title: "Pending Approvals", value: data.pendingApproval.count, change: `+${data.pendingApproval.pendingProducts} Products`, icon: MailWarningIcon },
    ];
  }, [apiResponse, isLoading]);

  const recentActivity = apiResponse?.data?.recentActivity || [];

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-muted/50 aspect-video rounded-xl !p-4 flex flex-col justify-around items-start"
            >
              <div className="text-sm flex gap-2 items-center">
                <Icon className="size-4" />
                {stat.title}
              </div>
              <h4 className="text-3xl">{stat.value}</h4>
              <div className="text-green-700 text-sm flex gap-2 items-center">
                <TrendingUpIcon className="size-4" />
                {stat.change} (Last 7 Days)
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <ChartAreaInteractive />
      </div>

      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min !p-4 flex flex-col items-start">
        <h3 className="text-sm font-semibold !pb-2">Recent Activity</h3>
        <div className="flex-1 w-full grid auto-rows-min gap-4 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-muted/50 rounded-xl !p-4 flex flex-col justify-around items-start space-y-2">
                <div className="flex-1 w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex justify-end w-full">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
            : recentActivity.slice(0, 3).map((activity: any) => (
              <div
                key={activity.id}
                className="bg-muted/50 rounded-xl !p-4 flex flex-col justify-between items-start"
              >
                <p className="flex-1 text-sm">{activity.data.message}</p>
                <div className="flex justify-end items-end w-full text-sm text-muted-foreground pt-2">
                  {formatTime(activity.created_at)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}