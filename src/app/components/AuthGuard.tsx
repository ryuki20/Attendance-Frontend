"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Employee } from "../types";

type Props = {
  children: (employee: Employee) => React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [employee] = useState<Employee | null>(() => {
    const stored = sessionStorage.getItem("AuthEmployee");
    const token = sessionStorage.getItem("token");

    if (!stored || !token) {
      return null;
    }

    return JSON.parse(stored) as Employee;
  });

  useEffect(() => {
    if (!employee) {
      router.push("/login");
    }
  }, [employee, router]);

  if (!employee) return null;

  return <>{children(employee)}</>;
}
