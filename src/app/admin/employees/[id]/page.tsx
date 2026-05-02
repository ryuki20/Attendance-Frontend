"use client";
import { AdminGuard } from "@/src/app/components/AdminGuard";
import { apiFetch } from "@/src/app/lib/api";
import type { Employee, EmployeeDetailResponse } from "@/src/app/types";
import { isoToHHMM } from "@/src/app/utils";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function EmployeeDetail({ employee }: { employee: Employee }) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [detail, setDetail] = useState<EmployeeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    borderRadius: 6,
    border: "0.5px solid var(--border)",
    background: "var(--surface-muted)",
    fontSize: 13,
    color: "var(--text-primary)",
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/employees/${id}`);
        if (!res.ok) throw new Error("取得失敗");
        const data: EmployeeDetailResponse = await res.json();
        setDetail(data);
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await apiFetch(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, email, role }),
      });
      if (!res.ok) throw new Error("更新失敗");
      const updated: EmployeeDetailResponse = await res.json();
      setDetail(updated);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 0",
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        読み込み中...
      </div>
    );
  }

  if (!detail) return null;

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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.push("/admin")}
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            ← 一覧に戻る
          </button>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            社員詳細
          </h1>
        </div>

        {/* 編集・保存ボタン */}
        {isEditing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "0.5px solid var(--border)",
                background: "transparent",
                fontSize: 13,
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
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
              保存
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "0.5px solid var(--border)",
              background: "transparent",
              fontSize: 13,
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            編集
          </button>
        )}
      </div>

      {/* 社員情報カード */}
      <div
        style={{
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          padding: "24px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <Field label="名前">
            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            ) : (
              <span>{detail.name}</span>
            )}
          </Field>
          <Field label="メールアドレス">
            {isEditing ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            ) : (
              <span>{detail.email}</span>
            )}
          </Field>
          <Field label="権限">
            {isEditing ? (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle}
              >
                <option value="employee">社員</option>
                <option value="admin">管理者</option>
              </select>
            ) : (
              <span>{detail.role === "admin" ? "管理者" : "社員"}</span>
            )}
          </Field>
          <Field label="登録日">
            <span>{detail.created_at.slice(0, 10)}</span>
          </Field>
        </div>
      </div>

      {/* 勤怠履歴 */}
      <h2
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: 12,
        }}
      >
        勤怠履歴
      </h2>
      <div
        style={{
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-muted)" }}>
              {["日付", "出勤", "退勤"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    textAlign: "left",
                    borderBottom: "0.5px solid var(--border)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detail.attendances.records.map((record) => (
              <tr key={record.id}>
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: 13,
                    color: "var(--text-primary)",
                    borderBottom: "0.5px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {record.date}
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: 13,
                    color: "var(--green)",
                    borderBottom: "0.5px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isoToHHMM(record.clock_in) ?? "--"}
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: 13,
                    color: "var(--red)",
                    borderBottom: "0.5px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isoToHHMM(record.clock_out) ?? "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
        {children}
      </span>
    </div>
  );
}

export default function EmployeeDetailPage() {
  return (
    <AdminGuard>
      {(employee) => <EmployeeDetail employee={employee} />}
    </AdminGuard>
  );
}
