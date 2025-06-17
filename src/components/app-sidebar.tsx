"use client";

import * as React from "react";
import {
  BriefcaseBusinessIcon,
  CreditCard,
  MegaphoneIcon,
  SquareTerminal,
  UsersRoundIcon,
  WorkflowIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@email.com",
    avatar: "/image/vsm-logo.webp",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Analytics",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: UsersRoundIcon,
      items: [
        {
          title: "Members",
          url: "/admin/users/members",
        },
        {
          title: "Stores",
          url: "/admin/users/stores",
        },
        {
          title: "Brands",
          url: "/admin/users/brands",
        },
        {
          title: "Wholesalers",
          url: "/admin/users/wholesalers",
        },
        {
          title: "Associations",
          url: "/admin/users/associations",
        },
        // {
        //   title: "Verification",
        //   url: "/admin/users/verification",
        // },
        {
          title: "Suspensions & Bans",
          url: "/admin/users/suspensions-bans",
        },
      ],
    },
    {
      title: "Business Management",
      url: "/admin/business",
      icon: BriefcaseBusinessIcon,
      items: [
        {
          title: "Approvals",
          url: "/admin/business/approvals",
        },
        {
          title: "Listing Editor",
          url: "/admin/business/listing-editor",
        },
        {
          title: "Subscriptions & Billing",
          url: "/admin/business/subscriptions-billing",
        },
      ],
    },
    {
      title: "Content Moderation",
      url: "/admin/moderation",
      icon: WorkflowIcon,
      items: [
        {
          title: "Home",
          url: "/admin/moderation/home",
        },
        {
          title: "Reviews",
          url: "/admin/moderation/reviews",
        },
        {
          title: "Trending & Featured",
          url: "/admin/moderation/trending-featured",
        },
        {
          title: "Disputes & Tickets",
          url: "/admin/moderation/disputes-tickets",
        },
        {
          title: "Articles",
          url: "/admin/moderation/articles",
        },
        {
          title: "Violation Notices",
          url: "/admin/moderation/violation-notices",
        },
      ],
    },
    {
      title: "Advertising",
      url: "/admin/advertising",
      icon: MegaphoneIcon,
      items: [
        {
          title: "Ad Approvals",
          url: "/admin/advertising/ad",
        },
      ],
    },
    {
      title: "Billing Management",
      url: "/admin/billing",
      icon: CreditCard,
      items: [
        {
          title: "Subscriptions",
          url: "/admin/billing/subscriptions",
        },
        {
          title: "Orders and payments",
          url: "/admin/billing/orders",
        },
        {
          title: "B2B Transactions",
          url: "/admin/billing/b-to-b",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
