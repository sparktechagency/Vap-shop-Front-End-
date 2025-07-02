import { Suspense } from "react";
import Navbar from "@/components/core/navbar";
import MobileProfileNavigation from "@/components/core/mobile-profile-nav";
import Footer from "@/components/core/footer";
import ProfileLayoutShell from "./_me/profile-layout-shell";
import SkeletonMe from "./_me/skeleton-me";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return redirect("/");
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<SkeletonMe />}>
        <ProfileLayoutShell>{children}</ProfileLayoutShell>
      </Suspense>
      <MobileProfileNavigation />
      <Footer />
    </>
  );
}
