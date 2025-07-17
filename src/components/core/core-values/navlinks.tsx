"use client";

import Link from "next/link";
import { BellIcon, MessageSquareIcon } from "lucide-react";
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

  // Fetch user data, but only if the token exists
  const { data: userData } = useGetOwnprofileQuery(undefined, {
    skip: !token,
  });

  // Separate counts for notifications and conversations
  const notificationCount = userData?.data?.unread_notification || 0;
  const conversationCount = userData?.data?.unread_conversations_count || 0;

  // Effect to check for the authentication token
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

  // Define actions that are only visible to logged-in users
  const dynamicNavActions: NavActionType[] = [
    {
      icon: <BellIcon className="size-4" />,
      variant: "ghost",
      size: "icon",
      href: "/me/notification", // Link to notifications page
      unread_notification: notificationCount, // Use the specific count for notifications
      requiresAuth: true,
    },
    {
      icon: <MessageSquareIcon className="size-4" />,
      variant: "ghost",
      size: "icon",
      href: "/chat", // Link to conversations/chat page
      unread_notification: conversationCount, // Use the specific count for conversations
      requiresAuth: true,
    },
  ];

  const allActions = [...staticNavActions, ...dynamicNavActions];
  const isAuthenticated = !!userData?.data && !!token;

  return (
    <div className="flex items-center gap-2">
      {allActions.map((action, index) => {
        // Hide auth-required actions if not logged in
        if (action.requiresAuth && !isAuthenticated) return null;
        // Hide login/register if logged in
        if (action.requiresAuth === false && isAuthenticated) return null;
        // Don't render the icon if its count is 0
        if (action.requiresAuth && action.unread_notification === 0) return null;


        return action.asChild ? (
          <Button key={index} variant={action.variant} asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Link key={index} href={action.href}>
            {action.unread_notification !== undefined && action.icon ? (
              <div className="relative inline-block">
                <Button variant={action.variant} size={action.size}>
                  {action.icon}
                </Button>
                {action.unread_notification > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-[6px] py-[1px] rounded-full font-semibold">
                    {action.unread_notification > 99
                      ? "99+"
                      : action.unread_notification}
                  </span>
                )}
              </div>
            ) : (
              <Button variant={action.variant} size={action.size}>
                {action.icon || action.label}
              </Button>
            )}
          </Link>
        );
      })}
    </div>
  );
};
