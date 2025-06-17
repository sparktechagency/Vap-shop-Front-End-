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

export default function MobileMenu() {
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
            {navActions.map((action, i) =>
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
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
