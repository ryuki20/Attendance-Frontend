"use client";
import { useState, useCallback } from "react";
import type { Records, AuthUser } from "./types";
import { dateKey, fmtTime } from "./utils";
import { PunchButton } from "./components/PunchButton";
import { Calendar } from "./components/Calendar";
import { SummaryCards } from "./components/SummaryCards";
import { AuthGuard } from "./components/AuthGuard";
import { useRouter } from "next/navigation";

// サンプルデータ（実際はlocalStorageやAPIから取得）
function buildSeedRecords(): Records {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const pad = (n: number) => String(n).padStart(2, "0");

  const seed: {
    d: number;
    in: string;
    out: string;
    break: number;
    overtime: number;
  }[] = [
    { d: 1, in: "09:02", out: "18:15", break: 60, overtime: 0 },
    { d: 2, in: "08:55", out: "18:30", break: 60, overtime: 0 },
    { d: 3, in: "09:10", out: "17:45", break: 60, overtime: 0 },
    { d: 6, in: "09:00", out: "19:00", break: 60, overtime: 60 },
    { d: 7, in: "08:48", out: "18:10", break: 60, overtime: 0 },
    { d: 8, in: "09:05", out: "18:25", break: 60, overtime: 0 },
    { d: 9, in: "09:15", out: "18:00", break: 60, overtime: 0 },
    { d: 10, in: "08:58", out: "17:55", break: 60, overtime: 0 },
    { d: 13, in: "09:03", out: "18:40", break: 60, overtime: 30 },
    { d: 14, in: "09:00", out: "18:20", break: 60, overtime: 0 },
    { d: 15, in: "09:12", out: "19:10", break: 60, overtime: 90 },
    { d: 16, in: "08:50", out: "18:05", break: 60, overtime: 0 },
    { d: 17, in: "09:08", out: "17:50", break: 60, overtime: 0 },
  ];

  const records: Records = {};
  seed.forEach(({ d, in: inT, out, break: brk, overtime }) => {
    if (d < today.getDate()) {
      records[`${y}-${pad(m)}-${pad(d)}`] = {
        in: inT,
        out,
        break: brk,
        overtime,
      };
    }
  });
  return records;
}

type ToastState = { message: string; id: number };

function MyPage({ user }: { user: AuthUser }) {
  const router = useRouter();
  const today = new Date();
  const todayKey = dateKey(today);

  const [records, setRecords] = useState<Records>(buildSeedRecords);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [toast, setToast] = useState<ToastState | null>(null);

  // トーストを表示する（2.5秒後に消える）
  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => setToast((prev) => (prev?.id === id ? null : prev)), 2500);
  }, []);

  // 打刻処理
  const punch = useCallback(
    (type: "in" | "out") => {
      const now = new Date();
      const t = fmtTime(now);

      setRecords((prev) => {
        const dayRecord = prev[todayKey] ?? {};

        if (type === "in") {
          if (dayRecord.in) {
            showToast("出勤打刻済みです");
            return prev;
          }
          showToast(`出勤打刻: ${t}`);
          return { ...prev, [todayKey]: { ...dayRecord, in: t } };
        } else {
          if (!dayRecord.in) {
            showToast("先に出勤打刻をしてください");
            return prev;
          }
          if (dayRecord.out) {
            showToast("退勤打刻済みです");
            return prev;
          }
          showToast(`退勤打刻: ${t}`);
          return { ...prev, [todayKey]: { ...dayRecord, out: t } };
        }
      });
    },
    [todayKey, showToast],
  );

  const handleLogout = () => {
    sessionStorage.removeItem("authUser");
    router.push("/login");
  };

  const todayRecord = records[todayKey];
  const isWorking = !!todayRecord?.in && !todayRecord?.out;

  // カレンダーの月移動
  const prevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };
  const nextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "24px 16px",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "0.5px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(74,120,220,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--blue)",
              flexShrink: 0,
            }}
          >
            {/* {user.name.slice(0, 2)} */}
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              {/* {user.name} */}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {/* {user.department} · 社員ID: {user.employeeId} */}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              background: "transparent",
              border: "0.5px solid var(--border)",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        </div>

        {/* ステータスバー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            padding: "10px 14px",
            borderRadius: 10,
            background: "var(--surface-muted)",
            border: "0.5px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              flexShrink: 0,
              background: isWorking ? "var(--green)" : "var(--border-strong)",
            }}
          />
          <span style={{ fontSize: 13, color: "var(--text-muted)", flex: 1 }}>
            {!todayRecord?.in
              ? "本日の出勤記録なし"
              : isWorking
                ? "勤務中"
                : "退勤済み"}
          </span>
          {todayRecord?.in && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {todayRecord.in}
              {todayRecord.out ? ` - ${todayRecord.out}` : ""}
            </span>
          )}
        </div>

        {/* 打刻ボタン */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <PunchButton
            label="出勤時刻"
            time={todayRecord?.in}
            variant="in"
            onClick={() => punch("in")}
          />
          <PunchButton
            label="退勤時刻"
            time={todayRecord?.out}
            variant="out"
            onClick={() => punch("out")}
          />
        </div>

        {/* サマリー */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-muted)",
            marginBottom: 10,
            letterSpacing: "0.04em",
          }}
        >
          今月のサマリー
        </div>
        <div style={{ marginBottom: 24 }}>
          <SummaryCards
            records={records}
            year={today.getFullYear()}
            month={today.getMonth()}
          />
        </div>

        {/* カレンダー */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-muted)",
            marginBottom: 10,
            letterSpacing: "0.04em",
          }}
        >
          勤務 日別データ
        </div>
        <Calendar
          year={viewYear}
          month={viewMonth}
          records={records}
          today={today}
          onPrev={prevMonth}
          onNext={nextMonth}
        />
      </div>

      {/* トースト通知 */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--surface)",
            border: "0.5px solid var(--border-strong)",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            zIndex: 99,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
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
          --amber: #85510b;
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
            --amber: #f0b429;
          }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}

export default function App() {
  return <AuthGuard>{(user) => <MyPage user={user} />}</AuthGuard>;
}
