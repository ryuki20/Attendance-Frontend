"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { apiFetch } from "../lib/api";
import type {
  Application,
  ApplicationListResponse,
  ApplicationStatus,
  Employee,
} from "../types";
import { isoToHHMM } from "../utils";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "申請中",
    color: "var(--amber)",
    bg: "rgba(133,81,11,0.1)",
  },
  APPROVED: {
    label: "承認済み",
    color: "var(--green)",
    bg: "rgba(59,109,17,0.1)",
  },
  REJECTED: { label: "却下", color: "var(--red)", bg: "rgba(163,45,45,0.1)" },
};

function ApplicationList({}: { employee: Employee }) {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/applications");
        if (!res.ok) throw new Error("取得失敗");
        const data: ApplicationListResponse = await res.json();
        setApplications(data.applications);
        setTotal(data.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const thStyle: React.CSSProperties = {
    padding: "10px 16px",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--text-muted)",
    textAlign: "left",
    borderBottom: "0.5px solid var(--border)",
    whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: 13,
    color: "var(--text-primary)",
    borderBottom: "0.5px solid var(--border)",
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {/* ヘッダー */}
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
            申請一覧
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            全 {total} 件
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 8,
              border: "0.5px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            ← マイページ
          </button>
          <button
            onClick={() => router.push("/applications/new")}
            style={{
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              background: "var(--blue)",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            + 新規申請
          </button>
        </div>
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
              <tr style={{ background: "var(--surface-muted)" }}>
                <th style={thStyle}>対象日</th>
                <th style={thStyle}>修正出勤</th>
                <th style={thStyle}>修正退勤</th>
                <th style={thStyle}>申請理由</th>
                <th style={thStyle}>ステータス</th>
                <th style={thStyle}>申請日</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    申請はありません
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const status = STATUS_CONFIG[app.status];
                  return (
                    <tr key={app.id}>
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                        }}
                      >
                        {app.details.date}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: "var(--green)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {isoToHHMM(app.details.requested_clock_in) ?? "--"}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: "var(--red)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {isoToHHMM(app.details.requested_clock_out) ?? "--"}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {app.reason}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 4,
                            color: status.color,
                            background: status.bg,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                        }}
                      >
                        {app.created_at.slice(0, 10)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function ApplicationPage() {
  return (
    <AuthGuard>
      {(employee) => <ApplicationList employee={employee} />}
    </AuthGuard>
  );
}
