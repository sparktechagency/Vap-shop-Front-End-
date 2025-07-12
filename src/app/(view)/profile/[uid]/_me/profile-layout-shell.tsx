import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FlagIcon, MessageSquareMoreIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import MobileProfileNavigation from "@/components/core/mobile-profile-nav";
import howl from "@/lib/howl";
import { cookies } from "next/headers";
import { UserData } from "@/lib/types/apiTypes";
export default async function ProfileLayoutShell({
  children,
  id,
}: Readonly<{
  children: React.ReactNode;
  id: string;
}>) {
  const token = (await cookies()).get("token")?.value;
  const call = await howl({ link: `profile/${id}`, token });
  // const call = await howl({ link: `me`, token });
  console.log(id);

  const my: UserData = call.data;

  return (
    <>
      <main className="w-full">
        <div
          className="h-[250px] md:h-[350px] lg:h-[400px] w-full relative "
          style={{
            backgroundImage:
              "linear-gradient(to top right, var(--background) 0%, rgba(128, 90, 213, 0.5) 40%, #331F60 100%)",
          }}
        >
          <Avatar className="size-[120px] md:size-[220px] lg:size-[300px] absolute -bottom-[60px] md:-bottom-[110px] lg:-bottom-[150px] right-1/2 translate-x-1/2 md:translate-0 md:right-4 lg:right-12 border">
            <AvatarImage src={my.avatar} className="object-cover" />
            <AvatarFallback>
              {my.first_name.toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="">
          <div className="w-full !px-14 !pb-10 md:!pb-30">
            <div className="flex flex-col md:items-end md:justify-end w-full !pr-0 md:!pr-[250px] lg:!pr-[calc(3rem+(130px*2))]">
              <div className="w-full !py-4 md:!p-6 !space-y-4 !mt-[64px] sm:!mt-0">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center sm:text-end">
                  {my.full_name}
                </h2>
                <p className="text-muted-foreground text-center sm:text-end">
                  {my.email}
                </p>

                <div className="flex flex-row md:flex-row justify-between items-center w-full gap-4">
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
              <Button variant="outline" size="icon">
                <FlagIcon />
              </Button>
              <Button
                // size="icon"
                variant="outline"
                className="hidden md:flex"
                asChild
              >
                <Link href={`/chat?email=${my?.email}`}>
                  <MessageSquareMoreIcon /> Send a message
                </Link>
              </Button>
              <Button variant="outline">Follow this account</Button>
            </div>

            <div className="">{children}</div>
          </div>
        </div>
      </main>
      <MobileProfileNavigation />
    </>
  );
}
