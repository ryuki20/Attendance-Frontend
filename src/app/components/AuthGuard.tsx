"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "../types";

type Props = {
  children: (user: AuthUser) => React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("authUser");
    const token = sessionStorage.getItem("token");

    if (!stored || token) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) return null;

  return <>{children(user)}</>;
}
