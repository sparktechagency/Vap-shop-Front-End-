import {
  // BadgeDollarSignIcon,
  // HeartIcon,
  BellIcon,
} from "lucide-react";
import { JSX } from "react";
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
