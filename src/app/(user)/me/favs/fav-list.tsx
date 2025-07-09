/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import howl from "@/lib/howl";
import { cookies } from "next/headers";
import React from "react";

export default async function FavList() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return <div>Please login to see favorites.</div>;
    }

    const my = await howl({ link: "me", token });

    if (!my?.ok || !my.data?.id) {
      return <div>Unable to fetch user info.</div>;
    }

    const myFavs = await howl({
      link: `get/${my.data.id}/products?type=brand&is_most_hearted=1`,
      token,
    });

    if (!myFavs?.ok) {
      return <div>Something went wrong while fetching favorites.</div>;
    }

    if (!Array.isArray(myFavs.data) || myFavs.data.length === 0) {
      return <div>No favourite product found.</div>;
    }

    return (
      <div>
        {myFavs.data.map((product: any) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    );
  } catch (error) {
    // Remove this if you really want 0 console logs:
    // console.error("FavList Error:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
}
