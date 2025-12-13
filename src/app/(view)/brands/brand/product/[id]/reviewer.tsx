import ProductReviewCard from "@/components/core/review-card";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { useGetReviewsQuery } from "@/redux/features/others/otherApi";
import React from "react";

export default function Reviewer({ product }: { product: any }) {
  const { data, isLoading, refetch } = useGetReviewsQuery({
    role: 3,
    id: product.id,
  });
  const { data: me } = useGetOwnprofileQuery();

  return (
    <div className="">
      <h3 className="text-3xl my-6!">Product Reviews</h3>
      <div className="space-y-6!">
        {!isLoading &&
          data?.data?.data.map((x: any) => (
            <ProductReviewCard
              key={x.id}
              data={x}
              productData={product}
              role={3}
              refetch={refetch}
              manage={x.user_id === me.data.id || String(me.data.role) === "1"}
            />
          ))}
      </div>
    </div>
  );
}
