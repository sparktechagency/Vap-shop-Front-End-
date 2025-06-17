import * as Lucide from "lucide-react";

export const navLinks = [
  {
    icon: <Lucide.User className="size-5" />,
    label: "View Profile",
    to: "/me",
  },
  {
    icon: <Lucide.UserPlus className="size-5" />,
    label: "Edit Profile",
    to: "/edit-me",
  },
  {
    icon: <Lucide.Bell className="size-5" />,
    label: "Notification",
    to: "/me/notification",
  },
  {
    icon: <Lucide.MailOpen className="size-5" />,
    label: "Orders & Requests",
    to: "/me/orders",
  },
  {
    icon: <Lucide.ListChecks className="size-5" />,
    label: "Reviews",
    to: "/me/reviews",
  },
  {
    icon: <Lucide.Settings className="size-5" />,
    label: "Settings",
    to: "/me/settings",
  },
  {
    icon: <Lucide.LogOut className="size-5" />,
    label: "Logout",
    to: "/logout",
  },
];
