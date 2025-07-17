import React from "react";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import Link from "next/link";
import { UserData } from "@/lib/types/apiTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NavActions } from "./core-values/navlinks"; // 1. Correctly import NavActions

export default function MobileMenu({ user }: { user?: UserData }) {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="!pb-0">
            <SheetTitle>
              <div
                className="size-10 bg-cover bg-no-repeat"
                style={{ backgroundImage: "url('/image/vsm-logo.webp')" }}
              />
            </SheetTitle>
          </SheetHeader>
          <div className="w-full flex flex-col gap-4 py-4 px-6 border-b">
            {/* 2. Updated logic to show user info or login/register */}
            {user ? (
              // If user is logged in, show their profile link
              <Button variant="outline" asChild>
                <Link
                  href={
                    Number(user.role) === 1
                      ? "/admin/dashboard"
                      : `/me?${user?.full_name?.toLowerCase()}`
                  }
                >
                  <Avatar className="size-6 mr-2">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="text-xs font-bold uppercase">
                      {user.full_name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  {user.first_name}
                </Link>
              </Button>
            ) : (
              // If user is logged out, NavActions will show Login/Register
              <NavActions />
            )}
          </div>

          <div className="flex flex-col gap-4 p-4">
            {/* You can add other mobile navigation links here */}
            {/* Example:
            <Link href="/trending">
              <Button variant="ghost" className="w-full justify-start">Trending</Button>
            </Link>
            <Link href="/forum">
              <Button variant="ghost" className="w-full justify-start">Forum</Button>
            </Link>
            */}
          </div>

          {/* 3. Show Logout and other actions for logged-in users */}
          {user && (
            <div className="absolute bottom-4 left-0 w-full px-4 flex flex-col gap-4">
              {/* NavActions will show the Notification bell for logged-in users */}
              <div className="p-2 bg-slate-100 rounded-md">
                <NavActions />
              </div>
              <Button variant="destructive" asChild>
                <Link href="/logout">Log out</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}