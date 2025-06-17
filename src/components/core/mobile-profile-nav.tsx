import React from "react";
import {
  BellIcon,
  Grid2x2Icon,
  LogOutIcon,
  NewspaperIcon,
  Settings2Icon,
  SettingsIcon,
  ShoppingBagIcon,
  User2Icon,
  UserRoundPenIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
export default function MobileProfileNavigation() {
  return (
    <div className="fixed md:hidden z-40 h-[64px] w-full bg-background bottom-0 left-0 border-t flex flex-row justify-around items-center">
      <div className="">
        <Popover>
          <PopoverTrigger asChild>
            <User2Icon />
          </PopoverTrigger>
          <PopoverContent className="!p-2">
            <Link
              href="#"
              className="flex gap-2 text-sm items-center hover:bg-secondary !p-2"
            >
              <User2Icon className="size-4" /> View Profile
            </Link>
            <Link
              href="#"
              className="flex gap-2 text-sm items-center hover:bg-secondary !p-2"
            >
              <UserRoundPenIcon className="size-4" /> Edit Profile
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      <div className="">
        <Link href="#">
          <BellIcon />
        </Link>
      </div>
      <div className="">
        <Popover>
          <PopoverTrigger asChild>
            <Grid2x2Icon />
          </PopoverTrigger>
          <PopoverContent className="!p-2">
            <Link
              href="#"
              className="flex gap-2 text-sm items-center hover:bg-secondary !p-2"
            >
              <ShoppingBagIcon className="size-4" /> Orders and Requests
            </Link>
            <Link
              href="#"
              className="flex gap-2 text-sm items-center hover:bg-secondary !p-2"
            >
              <NewspaperIcon className="size-4" /> Reviews
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      <div className="">
        <Popover>
          <PopoverTrigger asChild>
            <Settings2Icon />
          </PopoverTrigger>
          <PopoverContent className="!p-2">
            <Link
              href="#"
              className="flex gap-2 text-sm items-center hover:bg-secondary !p-2"
            >
              <SettingsIcon className="size-4" /> Settings
            </Link>
            <Link
              href="#"
              className="flex gap-2 text-sm items-center hover:bg-secondary !p-2"
            >
              <LogOutIcon className="size-4" /> Log out
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
