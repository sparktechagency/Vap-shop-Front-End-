import Link from "next/link";
import React, { Suspense } from "react";

import MobileProfileNavigation from "@/components/core/mobile-profile-nav";

import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import { UserData } from "@/lib/types/apiTypes";
import howl from "@/lib/howl";
import { cookies } from "next/headers";
import CoverPhoto from "./_inner-component/cover-photo";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { createNavLinks } from "../me/navLinks";
export default async function RootLayout({
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

  return (
    <>
      <Navbar />
      <main className="w-full">
        <Suspense
          fallback={
            <>
              <div className="h-[250px] md:h-[350px] lg:h-[400px]"></div>
            </>
          }
        >
          <CoverPhoto my={my} />
        </Suspense>

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
            <div className="">{children}</div>
          </div>
        </div>
      </main>
      <MobileProfileNavigation />
      <Footer />
    </>
  );
}
