import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquareMoreIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import {
  AssosiationnavLinks,
  BrandnavLinks,
  StorenavLinks,
  UsernavLinks,
  WholesalernavLinks,
} from "../navLinks";
import React from "react";
import MobileProfileNavigation from "@/components/core/mobile-profile-nav";
import howl from "@/lib/howl";
import { cookies } from "next/headers";
import { UserData } from "@/lib/types/apiTypes";
import UserProvider from "@/components/userProvider";
export default async function ProfileLayoutShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("token")?.value;
  const call = await howl({ link: "me", token });

  const my: UserData = call.data;

  function getNavs() {
    switch (parseInt(my.role)) {
      case 2:
        return AssosiationnavLinks;
      case 3:
        return BrandnavLinks;
      case 4:
        return WholesalernavLinks;
      case 5:
        return StorenavLinks;
      case 6:
        return UsernavLinks;
      default:
        return AssosiationnavLinks;
    }
  }
  getNavs();

  return (
    <>
      <main className="w-full">
        <div
          className="h-[250px] md:h-[350px] lg:h-[400px] w-full relative"
          style={{
            backgroundImage: my.cover_photo
              ? `url('${my.cover_photo}')`
              : "linear-gradient(to top right, var(--background) 0%, rgba(128, 90, 213, 0.5) 40%, #331F60 100%)",
          }}
        >
          <Avatar className="size-[120px] md:size-[220px] bg-background lg:size-[300px] absolute -bottom-[60px] md:-bottom-[110px] lg:-bottom-[150px] right-1/2 translate-x-1/2 md:translate-0 md:right-4 lg:right-[7%] border">
            <AvatarImage src={my.avatar} className="object-cover" />
            <AvatarFallback>
              {my.first_name.toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-10">
          <div className="hidden md:flex col-span-2 border-r flex-col justify-start !p-6">
            {getNavs().map((x, i) => (
              <Link
                href={x.to}
                key={i}
                className="!p-4 flex gap-2 w-full hover:bg-secondary cursor-pointer last-of-type:text-destructive"
              >
                {x.icon}
                {x.label}
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
                      <Link href="/chat">
                        <MessageSquareMoreIcon />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-semibold justify-center sm:justify-start flex-1">
                    <p>Followers: {my.total_followers}</p>
                    <p>Following: {my.total_following}</p>
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
              <Button
                size="icon"
                variant="outline"
                className="hidden md:flex"
                asChild
              >
                <Link href="/chat">
                  <MessageSquareMoreIcon />
                </Link>
              </Button>
              {/* <Button variant="outline">Follow this account</Button>
<Button variant="outline">Block this account</Button> */}
              <Button variant="outline" asChild>
                <Link href={`/profile/${my.id}`}>Preview Profile</Link>
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
