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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { navActions, navActionsBasic } from "./core-values/navlinks";
import Searcher from "../ui/searcher";
import MobileMenu from "./mobile-menu";
import CartDrawer from "../cart-drawer";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { UserData } from "@/lib/types/apiTypes";
import { ChevronDown, LayoutGridIcon, NotebookIcon } from "lucide-react";
import { usePathname } from "next/navigation";

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
  {
    title: "Brands",
    icon: <ChevronDown />,
    dropdown: {
      main: [{ label: "All brands", to: "/brands" }],
      sub: {
        title: "My Favourite Brands",
        items: [
          // { label: "All brands", to: "/brands" },
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
          // { label: "All stores", to: "/stores" },
        ],
      },
    },
  },
];

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [linkListDynamic, setLinkListDynamic] = useState(LinkList);
  const { data, isLoading, refetch } = useGetOwnprofileQuery();
  const pathname = usePathname();

  function reData() {
    setUser(data.data);
    const updated = [...LinkList];
    updated[3].dropdown!.sub.items = data.data.favourite_store_list.map(
      (x: { full_name: string; id: string }) => ({
        label: x.full_name,
        to: "#",
      })
    );
    updated[2].dropdown!.sub.items = data.data.favourite_brand_list.map(
      (x: { full_name: string; id: string }) => ({
        label: x.full_name,
        to: "#",
      })
    );
    setLinkListDynamic(updated); // linkListDynamic should be a state variable
  }

  useEffect(() => {
    if (document.cookie.includes("token")) {
      refetch().then((res) => {
        if (!("error" in res) && res.data) {
          setUser(res.data.data);
          const updated = [...LinkList];
          updated[3].dropdown!.sub.items =
            res.data.data.favourite_store_list.map(
              (x: { full_name: string; id: string }) => ({
                label: x.full_name,
                to: "#",
              })
            );
          updated[2].dropdown!.sub.items =
            res.data.data.favourite_brand_list.map(
              (x: { full_name: string; id: string }) => ({
                label: x.full_name,
                to: "#",
              })
            );
          setLinkListDynamic(updated);
        } else {
          setUser(null); // in case user is not logged in
          setLinkListDynamic(LinkList);
        }
      });
    } else {
      setUser(null);
      setLinkListDynamic(LinkList);
    }
  }, [pathname]);

  useEffect(() => {
    if (data) {
      reData();
    }
  }, [data]);

  useEffect(() => {
    if (document.cookie.includes("token")) {
      refetch();
    }
  }, []);

  return (
    <nav className="lg:h-[148px] w-full top-0 left-0 !px-4 lg:!px-[7%] !py-2 border-b shadow-sm flex flex-col justify-between items-stretch !space-y-6">
      <div className="h-1/2 flex flex-row justify-between items-center gap-4">
        <div className="">
          <Link
            href="/"
            className="flex flex-row justify-start items-center gap-2 text-sm lg:text-lg font-bold"
          >
            <div
              className="size-8 md:size-12 bg-cover bg-no-repeat"
              style={{ backgroundImage: "url('/image/VSM_VAPE.svg')" }}
            ></div>
            <span className="text-xs md:text-base ">Vape Shop Maps</span>
          </Link>
        </div>
        <Searcher className="flex-1 hidden lg:block" />
        <div className="flex flex-row justify-end items-center gap-2">
          <div className="flex flex-row justify-end items-center gap-2">
            <CartDrawer />
            {navActionsBasic.map((action, i) =>
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
          {!isLoading && (
            <div className="hidden lg:flex flex-row justify-end items-center gap-2">
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
                {link.dropdown.sub.items.length != 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      {link.dropdown.sub.title}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {link.dropdown.sub.items.map(
                        (subItem: { to: string; label: string }, subIdx) => (
                          <DropdownMenuItem key={`sub-${subIdx}`} asChild>
                            <Link href={subItem.to}>{subItem.label}</Link>
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={link.target} key={index}>
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
