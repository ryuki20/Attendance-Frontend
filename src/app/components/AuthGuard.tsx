"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "../types";

type Props = {
  children: (employee: Employee) => React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("AuthEmployee");
    const token = sessionStorage.getItem("token");

    if (!stored || !token) {
      router.push("/login");
      return;
    }
    setEmployee(JSON.parse(stored));
  }, [router]);

  if (!employee) return null;

  return <>{children(employee)}</>;
}
