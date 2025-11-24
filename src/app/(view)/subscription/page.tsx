'use client';
import { useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import Membersubscriptionpackage from "./membersubscriptionpackage/page";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";


export default function Page() {
  const { data: userProfile, isLoading } = useGetOwnprofileQuery(undefined);
  const user = userProfile?.data;
  // console.log('user======================================', user?.role_label);
  // console.log('user', user);

  const router = useRouter();


  useEffect(() => {
    if (!isLoading && user && user.role_label !== "Member") {
      router.replace('/');
    }
  }, [isLoading, user, router]);


  // 1. Show Skeleton while loading
  if (isLoading) {
    return (
      <div className="w-full h-[70dvh] p-12 grid grid-cols-3 gap-6">
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
      </div>
    );
  }

  // 2. If the user is loaded but not a Member, return null 
  //    and let the useEffect handle the redirection to the homepage.
  if (!user || user.role_label !== "Member") {
    return null;
  }

  // --- Only runs if user is loaded AND user.role_label is "Member" ---

  // Since we've confirmed the role is "Member" by this point, we can set the component.
  const RoleBasedComponent = <Membersubscriptionpackage />;


  return (
    <>
      {/* If the user is already subscribed */}
      {user.is_subscribed && (
        <div className="p-4 md:p-8">
          {/* Success message */}
          <div className="flex flex-col items-center justify-center text-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-8">
            <CheckCircle className="w-16 h-16 mb-4" />
            <h2 className="text-3xl font-bold">You are Already Subscribed!</h2>
            <p className="mt-2 text-lg">You have full access to all premium features available for your plan.</p>
          </div>

          {/* Disabled view of the subscription page */}
          <div className=" select-none">
            <h3 className="text-center text-xl font-semibold mb-4 text-muted-foreground">Your Current Subscription Plan</h3>
            {RoleBasedComponent}
          </div>
        </div>
      )}

      {/* If the user is NOT subscribed, show the normal subscription package options */}
      {!user.is_subscribed && RoleBasedComponent}
    </>
  );
}