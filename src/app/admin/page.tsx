"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminGuard } from "../components/AdminGuard";
import { apiFetch } from "../lib/api";
import type { Employee, EmployeeListResponse } from "../types";

function EmployeeList({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/employees");
        if (!res.ok) throw new Error("取得失敗");
        const data: EmployeeListResponse = await res.json();
        setEmployees(data.employees);
        setTotal(data.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const thStyle: React.CSSProperties = {
    padding: "10px 16px",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--text-muted)",
    textAlign: "left",
    borderBottom: "0.5px solid var(--border)",
    background: "var(--surface-muted)",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: 13,
    color: "var(--text-primary)",
    borderBottom: "0.5px solid var(--border)",
  };

  return (
    <div>
      {/* ページヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            社員一覧
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            全 {total} 名
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/employees/new")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "var(--blue)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + 社員を追加
        </button>
      </div>

      {/* テーブル */}
      <div
        style={{
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            読み込み中...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>名前</th>
                <th style={thStyle}>メールアドレス</th>
                <th style={thStyle}>権限</th>
                <th style={thStyle}>登録日</th>
                <th style={{ ...thStyle, textAlign: "center" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={{ background: "var(--surface)" }}>
                  <td style={tdStyle}>{emp.name}</td>
                  <td style={tdStyle}>{emp.email}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          emp.role === "admin"
                            ? "rgba(24,95,165,0.1)"
                            : "rgba(0,0,0,0.05)",
                        color:
                          emp.role === "admin"
                            ? "var(--blue)"
                            : "var(--text-muted)",
                      }}
                    >
                      {emp.role === "admin" ? "管理者" : "社員"}
                    </span>
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                    }}
                  >
                    {emp.created_at.slice(0, 10)}{" "}
                    {/* "2024-01-01" の部分だけ表示 */}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button
                      onClick={() => router.push(`/admin/employees/${emp.id}`)}
                      style={{
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 6,
                        border: "0.5px solid var(--border)",
                        background: "transparent",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      {(employee) => <EmployeeList employee={employee} />}
    </AdminGuard>
  );
}
