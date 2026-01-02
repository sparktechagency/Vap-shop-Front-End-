import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InboxIcon,
  MessageSquareMoreIcon,
  SettingsIcon,
  UserRoundX,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import MobileProfileNavigation from "@/components/core/mobile-profile-nav";
import howl from "@/lib/howl";
import { cookies } from "next/headers";
import { UserData } from "@/lib/types/apiTypes";
import UserProvider from "@/components/userProvider";
import { redirect } from "next/navigation";
import { createNavLinks } from "../navLinks";
import { cn } from "@/lib/utils";
import MeSharer from "./me-sharer";
import { Badge } from "@/components/ui/badge";
export default async function ProfileLayoutShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return redirect("/");
  }

  const call = await howl({ link: "me", token });

  const my: UserData = call.data;

  function getNavs(role: number) {
    switch (role) {
      case 2:
        return createNavLinks("association");
      case 3:
        return createNavLinks("brand");
      case 4:
        return createNavLinks("wholesaler");
      case 5:
        return createNavLinks("store");
      case 6:
        return createNavLinks("user");
      default:
        return createNavLinks("association");
    }
  }

  // getNavs(parseInt(my?.role_label?.toLowerCase() ?? "association"));
  if (!my) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <UserRoundX className="h-10 w-10 opacity-60" />

        <p className="text-sm font-medium text-foreground">
          Profile is currently unavailable
        </p>

        <p className="text-xs text-muted-foreground text-center max-w-xs">
          This user information is no longer available.
        </p>
      </div>
    );
  }

  return (
    <>
      <main className="w-full">
        <div
          className="h-[250px] md:h-[350px] lg:h-[400px] w-full relative bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: my.cover_photo
              ? `url('${my.cover_photo}')`
              : "linear-gradient(to top right, var(--background) 0%, rgba(128, 90, 213, 0.5) 40%, #331F60 100%)",
          }}
        >
          <Avatar className="size-[120px] md:size-[220px] bg-background lg:size-[300px] absolute -bottom-[60px] md:-bottom-[110px] lg:-bottom-[150px] right-1/2 translate-x-1/2 md:translate-0 md:right-4 lg:right-[7%] border">
            <AvatarImage src={my?.avatar} className="object-cover" />
            <AvatarFallback>
              {my.first_name.toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-10">
          <div className="hidden md:flex col-span-2 border-r flex-col justify-start !p-6">
            {getNavs(parseInt(my.role)).map(({ icon, label, to }, i) => (
              <Link
                href={to}
                key={label + i} // safer than just index
                className={cn(
                  "!p-4 flex gap-2 w-full hover:bg-secondary cursor-pointer",
                  label === "Logout" && "text-destructive"
                )}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          <div className="col-span-10 md:col-span-8 w-full !px-4 md:!pr-[5%] lg:!pr-[7%] !pb-10 md:!pb-30">
            <div className="flex flex-col md:items-end md:justify-end w-full !pr-0 md:!pr-[250px] lg:!pr-[340px]">
              <div className="w-full !py-4 md:!p-6 !space-y-4 !mt-[64px] sm:!mt-0">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center sm:text-end">
                  {my.full_name}
                </h2>
                <p className="text-muted-foreground text-center sm:text-end">
                  {my.email}
                </p>

                <div className="flex flex-row md:flex-row justify-between items-center w-full gap-4">
                  <div className="block sm:hidden">
                    <Button size="icon" variant="outline" asChild>
                      <Link href={`/chat?email=${my?.email}`}>
                        <MessageSquareMoreIcon />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-semibold justify-center sm:justify-start flex-1">
                    <p>Followers: {my.total_followers}</p>
                    <p>Following: {my.total_following}</p>
                    {my.subscription_data?.map((x, i) => (
                      <Badge
                        key={`${x.type}${i}`}
                        variant={x.type === "hemp" ? "success" : "special"}
                      >
                        {x.badge}
                      </Badge>
                    ))}
                  </div>
                  <Button size="icon" variant="ghost" asChild>
                    <Link href="/me/settings">
                      <SettingsIcon />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 !mt-6 md:!mt-8">
              <MeSharer me={my} />
              <Button
                size="icon"
                variant="outline"
                className="hidden md:flex"
                asChild
              >
                <Link href={`/chat`}>
                  <MessageSquareMoreIcon />
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link
                  href={
                    String(my.role) === "6"
                      ? `/profile/${my.id}?user=${my.full_name?.replace(
                        /\s+/g,
                        ""
                      )}`
                      : String(my.role) === "5"
                        ? `/stores/store/${my.id}?${my.full_name?.replace(
                          /\s+/g,
                          ""
                        )}`
                        : String(my.role) === "3"
                          ? `/brands/brand/${my.id}`
                          : `/profile/${my.id}?user=${my.full_name?.replace(
                            /\s+/g,
                            ""
                          )}`
                  }
                >
                  Preview Profile
                </Link>
              </Button>
              {/* <Button variant="outline">Settings</Button> */}
            </div>

            <div className="">
              <UserProvider user={my}>{children}</UserProvider>
            </div>
          </div>
        </div>
      </main>
      <MobileProfileNavigation />
    </>
  );
}
