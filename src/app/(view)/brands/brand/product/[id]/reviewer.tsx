/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductReviewCard from "@/components/core/review-card";
import { useGetReviewsQuery } from "@/redux/features/others/otherApi";
import React from "react";

export default function Reviewer({ product }: { product: any }) {
  const { data, isLoading, refetch } = useGetReviewsQuery({
    role: 3,
    id: product.id,
  });

  console.log(product);

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
              refetch={refetch()}
            />
          ))}
      </div>
    </div>
  );
}
