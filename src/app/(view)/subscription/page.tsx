// 'use client';

// import { Suspense } from "react";
// import Subsc from "./subsc";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
// import Membersubscriptionpackage from "./membersubscriptionpackage/page";
// import StoreSubscriptionPage from "./storesubscription/page";
// import WholesalerPage from "./wholesalersubscription/page";
// import BrandSubscription from "./brandsubscription/page";


// export default function Page() {
//   const { data: userProfile, isLoading } = useGetOwnprofileQuery(undefined);
//   const user = userProfile?.data;
//   console.log('user', user?.role_label);

//   if (isLoading || !user) {
//     return (
//       <div className="w-full h-[70dvh] p-12 grid grid-cols-3 gap-6">
//         <Skeleton className="w-full" />
//         <Skeleton className="w-full" />
//         <Skeleton className="w-full" />
//       </div>
//     );
//   }

//   return (
//     <>
//       {!user.is_subscribed && ![1, 2].includes(user.role) && (
//         <>
//           {user.role_label === "Member" && <Membersubscriptionpackage />}
//           {user.role_label === "Store" && <StoreSubscriptionPage />}
//           {user.role_label === "Wholesaler" && <WholesalerPage />}
//           {user.role_label === "Brand" && <BrandSubscription />}
//         </>
//       )}
//     </>
//   );
// }

'use client';

import { Suspense } from "react";
import Subsc from "./subsc";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import Membersubscriptionpackage from "./membersubscriptionpackage/page";
import StoreSubscriptionPage from "./storesubscription/page";
import WholesalerPage from "./wholesalersubscription/page";
import BrandSubscription from "./brandsubscription/page";
import { CheckCircle } from "lucide-react"; // Or any checkmark icon you prefer


export default function Page() {
  const { data: userProfile, isLoading } = useGetOwnprofileQuery(undefined);
  const user = userProfile?.data;
  console.log('user', user?.role_label);

  if (isLoading || !user) {
    return (
      <div className="w-full h-[70dvh] p-12 grid grid-cols-3 gap-6">
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
      </div>
    );
  }

  // Define the role-based component to render
  let RoleBasedComponent = null;
  if (user.role_label === "Member") {
    RoleBasedComponent = <Membersubscriptionpackage />;
  } else if (user.role_label === "Store") {
    RoleBasedComponent = <StoreSubscriptionPage />;
  } else if (user.role_label === "Wholesaler") {
    RoleBasedComponent = <WholesalerPage />;
  } else if (user.role_label === "Brand") {
    RoleBasedComponent = <BrandSubscription />;
  }

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

      {/* If the user is NOT subscribed, show the normal page */}
      {!user.is_subscribed && RoleBasedComponent}
    </>
  );
}