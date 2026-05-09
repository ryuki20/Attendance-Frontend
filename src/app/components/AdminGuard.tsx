"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { Employee } from "../types";

type Props = {
  children: (employee: Employee) => React.ReactNode;
};

export function AdminGuard({ children }: Props) {
  const router = useRouter();
  const { employee, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    if (!employee) {
      router.push("/login");
      return;
    }
    if (employee.role !== "admin") {
      router.push("/");
    }
  }, [employee, isHydrated, router]);

  if (!isHydrated || !employee || employee.role !== "admin") return <Spinner />;

  return <>{children(employee)}</>;
}

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: "2px solid rgba(0,0,0,0.1)",
          borderTopColor: "#185fa5",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
