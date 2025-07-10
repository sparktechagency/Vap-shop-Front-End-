import howl from "@/lib/howl";
import { cookies } from "next/headers";
import React from "react";
import MemberSub from "./member-sub";
import BuissnessSub from "./buissness-sub";

export default async function Subsc() {
  const token = (await cookies()).get("token")?.value;
  const my = await howl({ link: "me", token });
  console.log(my.data.role);

  if (my.data.role === 6) {
    return <MemberSub />;
  } else {
    return <BuissnessSub />;
  }
}
