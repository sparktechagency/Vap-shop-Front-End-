"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const navig = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      Cookies.remove("token");
      navig.push("/");
    }
  }, [navig]);

  return null;
}
