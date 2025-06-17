import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import MagicButton from "@/components/magic-button";
import { Suspense } from "react";

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
      <body className={`antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<>Just a second..</>}>{children}</Suspense>
          <Toaster />
          <MagicButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
