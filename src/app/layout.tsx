import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import MagicButton from "@/components/magic-button";
import { Suspense } from "react";
// import { Provider } from 'react-redux'
import StoreProvider from "@/components/StoreProvider";
import AgePopup from "@/components/core/age-popup";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Vape Shop Maps",
  description:
    "Connect, engage, and grow your presence in the world's first all-in-one social platform made for the vape industry.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return notFound();
  }

  return (
    <html lang="en" suppressHydrationWarning>
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
          <Suspense fallback={<>Just a second..</>}>
            <StoreProvider>{children}</StoreProvider>
          </Suspense>
          <Toaster />
          <MagicButton />
          <AgePopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
