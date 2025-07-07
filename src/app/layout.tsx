//  Keywords for Search Optimization:
// vap, vape, vape shop, vape shop maps, VSM, vapeshop, vapshop maps, vape shop maps, vape shop maps admin, vape shop maps admin panel , 

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { Suspense } from "react";

import StoreProvider from "@/components/StoreProvider";
import AgePopup from "@/components/core/age-popup";
import Image from "next/image";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Vape Shop Maps",
  description:
    "Connect, engage, and grow your presence in the world's first all-in-one social platform made for the vape industry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" type="image/webp" href="/image/vsm-logo.webp" />
      </Head>

      <body
        suppressHydrationWarning
        className={`antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <main className="h-dvh w-dvw flex flex-col justify-center items-center gap-4">
                <Image
                  height={124}
                  width={124}
                  src="/image/VSM_VAPE.svg"
                  alt="logo"
                  className="animate-pulse size-34"
                />
              </main>
            }
          >
            <StoreProvider>{children}</StoreProvider>
          </Suspense>
          <Toaster />
          <AgePopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
