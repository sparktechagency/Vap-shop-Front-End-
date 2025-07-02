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
import { navActions } from "./core-values/navlinks";
import Link from "next/link";
import { UserData } from "@/lib/types/apiTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
          <div className="w-full !pb-4 flex flex-row justify-between !px-6 border-b">
            {user ? (
              <Button variant="outline" asChild>
                <Link href="/me">
                  <Avatar className="size-6">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="text-xs font-bold uppercase">
                      {user.full_name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  {user.first_name}
                </Link>
              </Button>
            ) : (
              navActions.map((action, i) =>
                action.asChild ? (
                  <Button key={i} variant={action.variant} asChild>
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                ) : (
                  <Link key={i} href={action.href}>
                    <Button variant={action.variant} size={action.size}>
                      {action.icon || action.label}
                    </Button>
                  </Link>
                )
              )
            )}
          </div>

          {user && (
            <div className="p-4!">
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
