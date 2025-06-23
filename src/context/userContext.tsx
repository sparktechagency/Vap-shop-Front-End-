"use client";
import { createContext, useContext } from "react";
import { UserData } from "@/lib/types/apiTypes";

export const UserContext = createContext<UserData | null>(null);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUser must be used within a <UserContext.Provider>");
  return ctx;
}
