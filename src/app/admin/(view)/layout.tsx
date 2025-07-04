import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import howl from "@/lib/howl";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
    console.log("no token");
    throw redirect("/login");
  }
  const res = await howl({ link: "me", token: token });
  console.log("------------------------------------------");
  console.log(res);
  console.log("------------------------------------------");

  try {
    if (!res?.data || String(res.data.role) !== "1") {
      console.log("not an admin");

      throw redirect("/login");
    }
  } catch (error) {
    // If API call fails, redirect to login as fallback
    console.error("Middleware howl error:", error);
    throw redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 !px-4">
            <SidebarTrigger className="!-ml-1" />
            <Separator
              orientation="vertical"
              className="!mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 !p-4 !pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
