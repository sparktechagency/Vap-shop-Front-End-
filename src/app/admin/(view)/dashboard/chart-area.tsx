"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

// Import the RTK Query hook from your API slice
import { useGetAdminStatisticsQuery } from "@/redux/features/admin/AdminApis";

const chartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Define the type for the time range state
type TimeRange = "7days" | "30days" | "90days";

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<TimeRange>("7days");

  // Call the hook with the currently selected timeRange.
  // The hook will automatically re-fetch data when timeRange changes.
  const { data: apiResponse, isLoading } = useGetAdminStatisticsQuery({
    period: timeRange,
  });

  console.log('time range', timeRange);

  // Transform the API response into the format required by the chart.
  // This memoizes the calculation so it only runs when the API response changes.
  const chartData = React.useMemo(() => {
    const growthData = apiResponse?.data?.userGrowth?.original;
    if (!growthData || !growthData.labels || !growthData.datasets) {
      return [];
    }
    const currentYear = new Date().getFullYear();
    return growthData.labels.map((label: string, index: number) => {
      const dateStr = `${label} ${currentYear}`;
      return {
        date: new Date(dateStr).toISOString().split("T")[0],
        users: growthData.datasets[0].data[index] || 0,
      };
    });
  }, [apiResponse]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7days");
    }
  }, [isMobile]);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>User Growth</CardTitle>
        <CardDescription>
          {isLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            `A total of ${apiResponse?.data?.userGrowth?.original?.total_new_users ?? 0} new users in this period`
          )}
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value: string) => value && setTimeRange(value as TimeRange)}
            variant="outline"
            className="@[767px]/card:flex hidden"
            aria-label="Select a time range"
          >
            <ToggleGroupItem value="90days" className="h-8 !px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30days" className="h-8 !px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7days" className="h-8 !px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90days" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30days" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7days" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="!px-2 !pt-4 sm:!px-6 sm:!pt-6">
        {isLoading ? (
          <Skeleton className="aspect-auto h-[250px] w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-users)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-users)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="users"
                type="natural"
                fill="url(#fillUsers)"
                stroke="var(--color-users)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}