import Link from "next/link";
import React from "react";

import MobileProfileNavigation from "@/components/core/mobile-profile-nav";
import { navLinks } from "./navLinks";

import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import { headers } from "next/headers";
import { PenBoxIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DropOff from "@/components/core/drop-off";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = headers();
  const pathname = (await headerList).get("x-current-path");
  console.log(pathname);

  return (
    <>
      <Navbar />
      <main className="w-full">
        <div
          className="h-[250px] md:h-[350px] lg:h-[400px] w-full relative"
          style={{
            backgroundImage:
              "linear-gradient(to top right, var(--background) 0%, rgba(128, 90, 213, 0.5) 40%, #331F60 100%)",
          }}
        >
          <div className="">
            <Dialog>
              <DialogTrigger asChild>
                <div className="bg-background flex gap-2 absolute bottom-0 right-0 !p-2 border shadow items-center cursor-pointer text-sm">
                  <PenBoxIcon className="size-4" /> Set a cover photo
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Cover photo</DialogTitle>
                </DialogHeader>
                <div className="">
                  <DropOff />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-10">
          <div className="hidden md:flex col-span-2 border-r flex-col justify-start !p-6">
            {navLinks.map((x, i) => (
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
            <div className="">{children}</div>
          </div>
        </div>
      </main>
      <MobileProfileNavigation />
      <Footer />
    </>
  );
}
