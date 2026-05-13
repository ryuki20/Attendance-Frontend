"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AdminGuard } from "../../components/AdminGuard";
import { apiFetch } from "../../lib/api";
import {
  Application,
  ApplicationListResponse,
  type ApplicationStatus,
  type Employee,
} from "../../types";
import { isoToHHMM } from "../../utils";

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

function RequestList({}: { employee: Employee }) {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const query = statusFilter ? `?status=${statusFilter}` : "";
        const res = await apiFetch(`/admin/applications${query}`);
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
    fetchApplications();
  }, [statusFilter]);

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
            申請一覧
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            全 {total} 件
          </p>
        </div>

        {/* ステータスフィルター */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ApplicationStatus | "")
          }
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "0.5px solid var(--border)",
            background: "var(--surface)",
            fontSize: 13,
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          <option value="">すべてのステータス</option>
          <option value="PENDING">申請中</option>
          <option value="APPROVED">承認済み</option>
          <option value="REJECTED">却下</option>
        </select>
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
                <th style={thStyle}>社員名</th>
                <th style={thStyle}>対象日</th>
                <th style={thStyle}>修正出勤</th>
                <th style={thStyle}>修正退勤</th>
                <th style={thStyle}>申請理由</th>
                <th style={thStyle}>ステータス</th>
                <th style={{ ...thStyle, textAlign: "center" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                      <td style={tdStyle}>{app.employee.name}</td>
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
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button
                          onClick={() =>
                            router.push(`/admin/requests/${app.id}`)
                          }
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

export default function RequestPage() {
  return (
    <AdminGuard>{(employee) => <RequestList employee={employee} />}</AdminGuard>
  );
}
