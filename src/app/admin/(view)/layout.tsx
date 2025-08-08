/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import howl from "@/lib/howl";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import Link from "next/link";
export const metadata: Metadata = {
  title: "VSM Admin Panel",
  description: "Admin panel of vape shop maps",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    throw redirect("/login");
  }
  const res = await howl({ link: "me", token: token });

  try {
    if (!res?.data || String(res.data.role) !== "1") {
      console.log("not an admin");

      throw redirect("/login");
    }
  } catch (error) {
    console.error("Middleware howl error:", error);
    throw redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 !px-4 justify-between w-full">
            <div className="flex gap-2 items-center">
              <SidebarTrigger className="!-ml-1" />
              <Separator
                orientation="vertical"
                className="!mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
            <Button
              size={"icon"}
              variant={"outline"}
              className="rounded-full relative"
              asChild
            >
              <Link href={"/admin/notification"}>
                <BellIcon />
                {
                  // @ts-ignore
                  res?.data?.unread_notification_count > 0 && (
                    <span className="size-4 flex items-center justify-center bg-destructive rounded-full absolute -top-1 -right-1 !text-[8px] font-semibold text-background">
                      {res?.data?.unread_notifications}
                    </span>
                  )
                }
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 !p-4 !pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
