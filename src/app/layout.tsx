import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import StoreProvider from "@/components/StoreProvider";
import AgePopup from "@/components/core/age-popup";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Vape Shop Maps",
  description: "...",
  icons: {
    icon: "/image/vsm-logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className="antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
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
              {children}
            </Suspense>
            <Toaster />
            <AgePopup />
            {/* <SubscriptionModal /> */}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
