// components/UserProvider.tsx
"use client";

import { UserContext } from "@/context/userContext";
import { UserData } from "@/lib/types/apiTypes";

export default function UserProvider({
  user,
  children,
}: {
  user: UserData;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
