"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthGuard } from "../../components/AuthGuard";
import { apiFetch } from "../../lib/api";
import type { Employee } from "../../types";

function NewApplicationForm({}: { employee: Employee }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [date, setDate] = useState(searchParams.get("date") ?? "");
  const [clockIn, setClockIn] = useState(""); // "09:00" 形式
  const [clockOut, setClockOut] = useState(""); // "18:00" 形式
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // "2026-04-18" + "09:00" → "2026-04-18T09:00:00+09:00"
  const toRFC3339 = (date: string, time: string): string => {
    return `${date}T${time}:00+09:00`;
  };

  const handleSubmit = async () => {
    if (!date || !reason) {
      setError("対象日と申請理由は必須です");
      return;
    }
    if (!clockIn && !clockOut) {
      setError("修正出勤か修正退勤のどちらかは必須です");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        type: "ATTENDANCE_CORRECTION",
        date,
        reason,
      };
      if (clockIn) body.requested_clock_in = toRFC3339(date, clockIn);
      if (clockOut) body.requested_clock_out = toRFC3339(date, clockOut);

      const res = await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "申請に失敗しました");
        return;
      }

      router.push("/applications"); // 完了後は申請一覧へ
    } catch (e) {
      setError("通信エラーが発生しました");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "var(--text-muted)",
    marginBottom: 6,
    display: "block",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "0.5px solid var(--border)",
    background: "var(--surface-muted)",
    fontSize: 13,
    color: "var(--text-primary)",
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => router.push("/applications")}
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← 申請一覧
        </button>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          打刻修正申請
        </h1>
      </div>

      {/* フォーム */}
      <div
        style={{
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          padding: 24,
          display: "grid",
          gap: 20,
        }}
      >
        {/* 対象日 */}
        <div>
          <label style={labelStyle}>対象日 *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* 修正出勤 */}
        <div>
          <label style={labelStyle}>修正出勤時刻</label>
          <input
            type="time"
            value={clockIn}
            onChange={(e) => setClockIn(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* 修正退勤 */}
        <div>
          <label style={labelStyle}>修正退勤時刻</label>
          <input
            type="time"
            value={clockOut}
            onChange={(e) => setClockOut(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* 申請理由 */}
        <div>
          <label style={labelStyle}>申請理由 *</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="申請理由を入力してください"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* エラー */}
        {error && <p style={{ fontSize: 12, color: "var(--red)" }}>{error}</p>}

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: loading ? "var(--border)" : "var(--blue)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "送信中..." : "申請する"}
        </button>
      </div>
      <style>{`
      :root {
        --bg: #f5f4f1;
        --surface: #ffffff;
        --surface-muted: #f0efe9;
        --border: rgba(0,0,0,0.1);
        --border-strong: rgba(0,0,0,0.2);
        --text-primary: #1a1a18;
        --text-muted: #6b6a65;
        --green: #3b6d11;
        --red: #a32d2d;
        --blue: #185fa5;
        --font-sans: 'Helvetica Neue', Arial, sans-serif;
        --font-mono: 'SF Mono', 'Fira Code', monospace;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #18181a;
          --surface: #222224;
          --surface-muted: #2a2a2c;
          --border: rgba(255,255,255,0.1);
          --border-strong: rgba(255,255,255,0.22);
          --text-primary: #f0efe9;
          --text-muted: #8a8980;
          --green: #7ec850;
          --red: #e06060;
          --blue: #6fa8e8;
        }
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      button { font-family: inherit; }
    `}</style>
    </div>
  );
}

export default function NewApplicationPage() {
  return (
    <AuthGuard>
      {(employee) => (
        <Suspense fallback={<div>読み込み中...</div>}>
          <NewApplicationForm employee={employee} />
        </Suspense>
      )}
    </AuthGuard>
  );
}
