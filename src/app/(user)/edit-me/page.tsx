
import React, { Suspense } from "react";

import UserEditForm from "./user-edit-form";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";
import howl from "@/lib/howl";
import { UserData } from "@/lib/types/apiTypes";
import StoreEditForm from "./store-edit-form";
import AssociationEditForm from "./assos-edit-form";
import BrandEditForm from "./brand-edit-form";
import WholesalerEditForm from "./wholesaler-edit-form";
import UpdateAvatar from "./_inner-component/update-avatar";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;
  const call = await howl({ link: "me", token });
  const my: UserData = call.data;
  return (
    <div className="!p-12">
      <div className="">
        <Suspense fallback={<Skeleton className="size-[200px] rounded-full" />}>
          <UpdateAvatar my={my} />
        </Suspense>
        <div className="!py-12">
          <h1 className="text-3xl font-semibold !pb-2">
            Edit {my.role_label} Profile
          </h1>
          <hr />
          <div className="!py-12">
            {(() => {
              const role = parseInt(my.role);
              switch (role) {
                case 2:
                  return <AssociationEditForm my={my} />;
                case 3:
                  return <BrandEditForm my={my} />;
                case 4:
                  return <WholesalerEditForm my={my} />;
                case 5:
                  return <StoreEditForm my={my} />;
                case 6:
                  return <UserEditForm my={my} />;
                default:
                  return null;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}