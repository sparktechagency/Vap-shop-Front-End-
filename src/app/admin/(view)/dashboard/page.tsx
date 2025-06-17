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

const stats = [
  {
    icon: UsersRoundIcon,
    title: "Active Users",
    value: "782",
    change: "2.5%",
  },
  {
    icon: UserRoundPlusIcon,
    title: "New Users",
    value: "72,982",
    change: "2.5%",
  },
  {
    icon: BriefcaseBusinessIcon,
    title: "Active Businesses",
    value: "72,92",
    change: "2.5%",
  },
  {
    icon: Clock10Icon,
    title: "Pending Approvals",
    value: "782",
    change: "2.5%",
  },
  {
    icon: MailWarningIcon,
    title: "Recent Violations",
    value: "782",
    change: "2.5%",
  },
];

export default function Page() {
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
              <p className="text-sm flex gap-2 items-center">
                <Icon className="size-4" />
                {stat.title}
              </p>
              <h4 className="text-3xl">{stat.value}</h4>
              <p className="text-green-700 text-sm flex gap-2 items-center">
                <TrendingUpIcon className="size-4" />
                {stat.change}(Last 7 Days)
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <ChartAreaInteractive />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min !p-4 flex flex-col justify-between items-start">
        <h3 className="text-sm font-semibold !pb-2">Recent Activity</h3>
        <div className="flex-1 w-full grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 rounded-xl !p-4 flex flex-col justify-around items-start">
            <div className="flex-1">
              New Buissness{" "}
              <span className="font-semibold">“Vodoo Vape Shop”</span> awaiting
              approval
            </div>
            <div className="flex justify-end text-end items-end w-full text-sm text-muted-foreground">
              08:12 pm
            </div>
          </div>
          <div className="bg-muted/50  rounded-xl !p-4 flex flex-col justify-around items-start">
            <div className="flex-1">
              New Buissness{" "}
              <span className="font-semibold">“Vodoo Vape Shop”</span> awaiting
              approval
            </div>
            <div className="flex justify-end text-end items-end w-full text-sm text-muted-foreground">
              08:12 pm
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl !p-4 flex flex-col justify-around items-start">
            <div className="flex-1">
              New Buissness{" "}
              <span className="font-semibold">“Vodoo Vape Shop”</span> awaiting
              approval
            </div>
            <div className="flex justify-end text-end items-end w-full text-sm text-muted-foreground">
              08:12 pm
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
