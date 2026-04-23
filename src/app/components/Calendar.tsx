import React from "react";
import type { Records } from "../types";
import { dateKey, fmtMinutes } from "../utils";

type Props = {
  year: number;
  month: number; // 0-indexed
  records: Records;
  today: Date;
  onPrev: () => void;
  onNext: () => void;
};

const DOW = ["日", "月", "火", "水", "木", "金", "土"];

export const Calendar: React.FC<Props> = ({
  year,
  month,
  records,
  today,
  onPrev,
  onNext,
}) => {
  const lastDate = new Date(year, month + 1, 0).getDate();
  const todayKey = dateKey(today);

  // 当月の全日付を生成
  const rows = Array.from({ length: lastDate }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const key = dateKey(date);
    const dow = date.getDay();
    return { date, key, dow, record: records[key] };
  });

  const thStyle: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: 11,
    fontWeight: 500,
    color: "var(--text-muted)",
    textAlign: "left",
    borderBottom: "0.5px solid var(--border)",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "0.5px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* ナビゲーション */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "0.5px solid var(--border)",
        }}
      >
        <NavBtn onClick={onPrev}>&#8249;</NavBtn>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>
          {year}年{month + 1}月
        </span>
        <NavBtn onClick={onNext}>&#8250;</NavBtn>
      </div>

      {/* テーブル */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-muted)" }}>
              <th style={thStyle}>日付</th>
              <th style={{ ...thStyle, textAlign: "center" }}>曜日</th>
              <th style={{ ...thStyle, textAlign: "center" }}>出勤</th>
              <th style={{ ...thStyle, textAlign: "center" }}>退勤</th>
              <th style={{ ...thStyle, textAlign: "center" }}>休憩</th>
              <th style={{ ...thStyle, textAlign: "center" }}>残業</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ date, key, dow, record }) => {
              const isToday = key === todayKey;
              const isWeekend = dow === 0 || dow === 6;

              const rowStyle: React.CSSProperties = {
                borderBottom: "0.5px solid var(--border)",
                background: isToday
                  ? "rgba(24,95,165,0.05)"
                  : record?.in
                    ? "rgba(74,163,89,0.04)"
                    : "transparent",
              };

              const tdBase: React.CSSProperties = {
                padding: "9px 12px",
                color: "var(--text-primary)",
              };

              const dowColor =
                dow === 0 ? "var(--red)" : dow === 6 ? "var(--blue)" : "var(--text-muted)";

              return (
                <tr key={key} style={rowStyle}>
                  {/* 日付 */}
                  <td style={tdBase}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isToday ? 500 : 400,
                        color: isToday ? "var(--blue)" : isWeekend ? dowColor : "var(--text-primary)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {month + 1}/{String(date.getDate()).padStart(2, "0")}
                    </span>
                    {isToday && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 10,
                          color: "var(--blue)",
                          background: "rgba(24,95,165,0.1)",
                          padding: "1px 5px",
                          borderRadius: 4,
                        }}
                      >
                        今日
                      </span>
                    )}
                  </td>

                  {/* 曜日 */}
                  <td style={{ ...tdBase, textAlign: "center", color: dowColor }}>
                    {DOW[dow]}
                  </td>

                  {/* 出勤 */}
                  <td style={{ ...tdBase, textAlign: "center" }}>
                    {record?.in ? (
                      <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                        {record.in}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>--</span>
                    )}
                  </td>

                  {/* 退勤 */}
                  <td style={{ ...tdBase, textAlign: "center" }}>
                    {record?.out ? (
                      <span style={{ color: "var(--red)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                        {record.out}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>--</span>
                    )}
                  </td>

                  {/* 休憩 */}
                  <td style={{ ...tdBase, textAlign: "center" }}>
                    {record?.break ? (
                      <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                        {fmtMinutes(record.break)}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>--</span>
                    )}
                  </td>

                  {/* 残業 */}
                  <td style={{ ...tdBase, textAlign: "center" }}>
                    {record?.overtime ? (
                      <span style={{ color: "var(--amber)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                        {fmtMinutes(record.overtime)}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>--</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NavBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    style={{
      width: 28,
      height: 28,
      borderRadius: 8,
      border: "0.5px solid var(--border)",
      background: "transparent",
      cursor: "pointer",
      fontSize: 16,
      color: "var(--text-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </button>
);
