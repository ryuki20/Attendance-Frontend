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
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const query = statusFilter ? `?status=${statusFilter}` : "";
        const res = await apiFetch(`/applications${query}`);
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
  }, [statusFilter]);

  const handleCancel = async (id: string) => {
    if (!confirm("この申請を取り消しますか?")) return;

    try {
      const res = await apiFetch(`/applications/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "取消に失敗しました");
        return;
      }

      setApplications((prev) => prev.filter((app) => app.id !== id));
      setTotal((prev) => prev - 1);
    } catch (e) {
      alert("通信エラーが発生しました");
      console.error(e);
    }
  };

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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* サイドバー + メインの2カラムレイアウト */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* サイドバー */}
        <aside
          style={{
            width: 200,
            background: "var(--surface)",
            borderRight: "0.5px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            padding: "24px 0",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "0 20px 24px",
              borderBottom: "0.5px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              マイメニュー
            </div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px" }}>
            <button
              onClick={() => router.push("/applications")}
              className="nav-link active"
            >
              申請一覧
            </button>
          </nav>
          <div style={{ padding: "0 12px" }}>
            <button
              onClick={() => router.push("/")}
              className="nav-link"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "var(--blue)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              ← マイページ
            </button>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main style={{ flex: 1, padding: "32px" }}>
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
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
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
                    <th style={thStyle}>対象日</th>
                    <th style={thStyle}>修正出勤</th>
                    <th style={thStyle}>修正退勤</th>
                    <th style={thStyle}>申請理由</th>
                    <th style={thStyle}>ステータス</th>
                    <th style={thStyle}>申請日</th>
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
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {app.status === "PENDING" && (
                              <button
                                onClick={() => handleCancel(app.id)}
                                style={{
                                  fontSize: 12,
                                  padding: "4px 12px",
                                  borderRadius: 6,
                                  border: "0.5px solid var(--red)",
                                  background: "transparent",
                                  color: "var(--red)",
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                取消
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <style>{`
      :root {
        --bg: #f5f4f1; --surface: #ffffff; --surface-muted: #f0efe9;
        --border: rgba(0,0,0,0.1);
        --text-primary: #1a1a18; --text-muted: #6b6a65;
        --blue: #185fa5; --green: #3b6d11; --red: #a32d2d; --amber: #85510b;
        --font-sans: 'Helvetica Neue', Arial, sans-serif;
        --font-mono: 'SF Mono', 'Fira Code', monospace;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #18181a; --surface: #222224; --surface-muted: #2a2a2c;
          --border: rgba(255,255,255,0.1);
          --text-primary: #f0efe9; --text-muted: #8a8980;
          --blue: #6fa8e8; --green: #7ec850; --red: #e06060; --amber: #f0b429;
        }
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      button { font-family: inherit; }
      .nav-link {
        display: block; width: 100%;
        padding: 8px 12px; border-radius: 8px;
        border: none; background: transparent;
        font-size: 13px; color: var(--text-muted);
        cursor: pointer; text-align: left; margin-bottom: 4px;
        font-weight: 400;
      }
      .nav-link.active {
        color: var(--blue);
        background: rgba(24,95,165,0.08);
        font-weight: 500;
      }
    `}</style>
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
