import { Suspense } from "react";
import MobileProfileNavigation from "@/components/core/mobile-profile-nav";
import ProfileLayoutShell from "./_me/profile-layout-shell";
import SkeletonMe from "./_me/skeleton-me";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ uid: string }>;
}) {
  const uid = (await params).uid;
  return (
    <>
      <Suspense fallback={<SkeletonMe />}>
        <ProfileLayoutShell id={uid}>{children}</ProfileLayoutShell>
      </Suspense>
      <MobileProfileNavigation />
    </>
  );
}
