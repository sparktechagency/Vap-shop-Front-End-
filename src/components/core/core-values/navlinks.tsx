import {
  // BadgeDollarSignIcon,
  ChevronDown,
  LayoutGridIcon,
  NotebookIcon,
  // HeartIcon,
  BellIcon,
} from "lucide-react";
import { JSX } from "react";

export const LinkList = [
  {
    title: "Trending",
    icon: <LayoutGridIcon />,
    target: "/trending",
  },
  {
    title: "Forum",
    icon: <NotebookIcon />,
    target: "/forum",
  },
  // {
  //   title: "Subscriptions",
  //   icon: <BadgeDollarSignIcon />,
  //   target: "/subscriptions",
  // },
  {
    title: "Brands",
    icon: <ChevronDown />,
    dropdown: {
      main: [{ label: "All brands", to: "/brands" }],
      sub: {
        title: "My Favourite Brands",
        items: [
          { label: "All brands", to: "/brands" },
          { label: "All brands", to: "/brands" },
          { label: "All brands", to: "/brands" },
          { label: "All brands", to: "/brands" },
          { label: "All brands", to: "/brands" },
          { label: "All brands", to: "/brands" },
        ],
      },
    },
  },
  {
    title: "Stores",
    icon: <ChevronDown />,
    dropdown: {
      main: [{ label: "All stores", to: "/stores" }],
      sub: {
        title: "My Favourite Stores",
        items: [
          { label: "All stores", to: "/stores" },
          { label: "All stores", to: "/stores" },
          { label: "All stores", to: "/stores" },
          { label: "All stores", to: "/stores" },
          { label: "All stores", to: "/stores" },
          { label: "All stores", to: "/stores" },
        ],
      },
    },
  },
];

export interface NavActionsType {
  icon?: JSX.Element;
  variant:
    | "ghost"
    | "special"
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | null
    | undefined;
  size: "default" | "sm" | "lg" | "icon" | null | undefined;
  href: string;
  label?: string;
  asChild?: boolean;
}

export const navActionsBasic: NavActionsType[] = [
  {
    icon: <BellIcon />,
    variant: "ghost",
    size: "icon",
    href: "/me/notification",
  },
];

export const navActions: NavActionsType[] = [
  {
    label: "Log in",
    variant: "ghost",
    size: "lg",
    href: "/login",
  },
  {
    label: "Register",
    variant: "special",
    href: "/create-an-account",
    asChild: true,
    size: null,
  },
];
