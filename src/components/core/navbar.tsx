"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import Searcher from "../ui/searcher";
import MobileMenu from "./mobile-menu";
import CartDrawer from "../cart-drawer";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { ChevronDown, LayoutGridIcon, NotebookIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavActions } from "./core-values/navlinks";
import { useCookies } from "react-cookie";

export const LinkList = [
  {
    title: "Trending",
    icon: <LayoutGridIcon />,
    target: "/trending",
  },
  // {
  //   title: "Forum",
  //   icon: <NotebookIcon />,
  //   target: "/forum",
  // },
  {
    title: "Brands",
    icon: <ChevronDown />,
    dropdown: {
      main: [{ label: "All brands", to: "/brands" }],
      sub: {
        title: "My Favorite Brands",
        items: [] as { label: string; to: string }[],
      },
    },
  },
  {
    title: "Stores",
    icon: <ChevronDown />,
    dropdown: {
      main: [{ label: "All stores", to: "/stores" }],
      sub: {
        title: "My Favorite Stores",
        items: [] as { label: string; to: string }[],
      },
    },
  },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [{ token }] = useCookies(["token"]);

  // directly rely on RTK Query
  const { data, isLoading, refetch } = useGetOwnprofileQuery(undefined, {
    skip: !token,
  });

  const user = data?.data ?? null;
  const role = Number(user?.role);

  const [linkListDynamic, setLinkListDynamic] = useState(LinkList);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token && user) {
      const updated = [...LinkList];
      updated[2].dropdown!.sub.items = user.favourite_store_list.map(
        (x: { full_name: string; id: string }) => ({
          label: x.full_name,
          to: `/stores/store/${x.id}`,
        })
      );
      updated[1].dropdown!.sub.items = user.favourite_brand_list.map(
        (x: { full_name: string; id: string }) => ({
          label: x.full_name,
          to: `/brands/brand/${x.id}`,
        })
      );
      setLinkListDynamic(updated);
    } else {
      setLinkListDynamic(LinkList);
    }
  }, [token, user]);

  // refetch on route change if logged in
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [pathname, token, refetch]);

  if (!mounted) return null;

  return (
    <nav className="lg:h-[148px] w-full top-0 left-0 !px-4 lg:!px-[6%] !py-2 border-b shadow-sm flex flex-col justify-between items-stretch !space-y-6">
      <div className="h-1/2 flex flex-row justify-between items-center gap-4">
        <div>
          <Link
            href="/"
            className="flex flex-row justify-start items-center gap-2 text-sm lg:text-lg font-bold"
          >
            <div className="size-8 md:size-12 bg-[url('/image/VSM_VAPE.svg')] bg-cover bg-no-repeat"></div>
            <span className="text-xs md:text-base">Vape Shop Maps</span>
          </Link>
        </div>

        <Searcher className="flex-1 hidden lg:block" />

        <div className="flex flex-row justify-end items-center gap-2">
          <CartDrawer />
          <NavActions />

          {/* ✅ User Actions */}
          {!isLoading && (
            <div
              className="hidden lg:flex flex-row justify-end items-center gap-2"
              suppressHydrationWarning
            >
              {user && token && (
                <Button variant="outline" asChild>
                  <Link
                    href={
                      role === 1
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
              )}
            </div>
          )}

          <div className="lg:hidden">
            <MobileMenu user={user ?? undefined} />
          </div>
        </div>
      </div>

      <Searcher className="flex-1 block lg:hidden" />

      <div className="lg:h-1/2 grid sm:flex grid-cols-2 flex-row justify-start items-center !py-1 sm:!py-4">
        {linkListDynamic.map((link, index) =>
          link.dropdown ? (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-xs md:text-base w-full sm:w-auto"
                >
                  {link.title} {link.icon}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {link.dropdown.main.map((item, idx) => (
                  <DropdownMenuItem key={`main-${idx}`} asChild>
                    <Link href={item.to}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                {link.dropdown.sub.items.length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      {link.dropdown.sub.title}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {link.dropdown.sub.items.map((subItem, subIdx) => (
                        <DropdownMenuItem key={`sub-${subIdx}`} asChild>
                          <Link href={subItem.to}>{subItem.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={link.target!} key={index}>
              <Button
                variant="ghost"
                className="text-xs md:text-base w-full sm:w-auto"
              >
                {link.title} {link.icon}
              </Button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
