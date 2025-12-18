"use client";

import Link from "next/link";
import { Bell, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export interface NavActionType {
  icon?: React.ReactNode;
  variant?:
    | "ghost"
    | "special"
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  href: string;
  label?: string;
  asChild?: boolean;
  unread_notification?: number;
  requiresAuth?: boolean;
}

// Actions for logged-out users
export const staticNavActions: NavActionType[] = [
  {
    label: "Log in",
    variant: "ghost",
    size: "lg",
    href: "/login",
    requiresAuth: false,
  },
  {
    label: "Register",
    variant: "special",
    href: "/create-an-account",
    asChild: true,
    size: null,
    requiresAuth: false,
  },
];

export const NavActions = () => {
  const [token, setToken] = useState<string | undefined>(undefined);

  const { data: userData } = useGetOwnprofileQuery(undefined, {
    skip: !token,
  });
  const notificationCount = userData?.data?.unread_notifications || 0;
  const conversationCount = userData?.data?.unread_conversations_count || 0;

  useEffect(() => {
    const checkToken = () => {
      const newToken = Cookies.get("token");
      if (newToken !== token) {
        setToken(newToken);
      }
    };
    checkToken();
    const interval = setInterval(checkToken, 2000);
    return () => clearInterval(interval);
  }, [token]);

  const dynamicNavActions: NavActionType[] = [
    {
      icon: <Bell className="size-4" />,
      variant: "ghost",
      size: "icon",
      href: "/me/notification",
      unread_notification: notificationCount,
      requiresAuth: true,
    },
    {
      icon: <MessageSquare className="size-4" />,
      variant: "ghost",
      size: "icon",
      href: "/chat",
      unread_notification: conversationCount,
      requiresAuth: true,
    },
  ];

  const allActions = [...staticNavActions, ...dynamicNavActions];
  const isAuthenticated = !!userData?.data && !!token;

  return (
    <div className="lg:flex items-center gap-2 hidden">
      {allActions.map((action, index) => {
        const shouldHide =
          (action.requiresAuth && !isAuthenticated) ||
          (action.requiresAuth === false && isAuthenticated);

        if (shouldHide) return null;

        return action.asChild ? (
          <Button key={index} variant={action.variant} asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Link key={index} href={action.href}>
            {action.icon ? (
              <div className="relative inline-block">
                <Button variant={action.variant} size={action.size}>
                  {action.icon}
                </Button>

                {typeof action.unread_notification === "number" &&
                  action.unread_notification > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-[6px] py-[1px] rounded-full font-semibold">
                      {action.unread_notification > 99
                        ? "99+"
                        : action.unread_notification}
                    </span>
                  )}
              </div>
            ) : (
              <Button variant={action.variant} size={action.size}>
                {typeof action.label === "string" && action.label.trim() !== ""
                  ? action.label
                  : null}
              </Button>
            )}
          </Link>
        );
      })}
    </div>
  );
};
