import React from "react";
import type { AttendanceRecords } from "../types";
import { calcMinutes, fmtMinutes, parseKey } from "../utils";

type Props = {
  records: AttendanceRecords;
  year: number;
  month: number; // 0-indexed
};

type Summary = {
  days: number;
  totalMinutes: number;
  avgOut: string;
};

function calcSummary(
  records: AttendanceRecords,
  year: number,
  month: number
): Summary {
  let days = 0;
  let totalMinutes = 0;
  const outHours: number[] = [];

  Object.entries(records).forEach(([key, record]) => {
    const parsed = parseKey(key);
    if (parsed.year !== year || parsed.month !== month) return;

    if (record.in) days++;

    if (record.in && record.out) {
      totalMinutes += calcMinutes(record.in, record.out);
      outHours.push(parseInt(record.out.split(":")[0]));
    }
  });

  const avgOut =
    outHours.length > 0
      ? `${Math.round(outHours.reduce((a, b) => a + b, 0) / outHours.length)}時`
      : "--";

  return { days, totalMinutes, avgOut };
}

export const SummaryCards: React.FC<Props> = ({ records, year, month }) => {
  const { days, totalMinutes, avgOut } = calcSummary(records, year, month);

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}
    >
      <MetricCard label="出勤日数" value={String(days)} unit="日" />
      <MetricCard label="総労働時間" value={fmtMinutes(totalMinutes)} unit="" />
      <MetricCard label="平均退勤" value={avgOut} unit="" />
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; unit: string }> = ({
  label,
  value,
  unit,
}) => (
  <div
    style={{
      background: "var(--surface-muted)",
      borderRadius: 8,
      padding: "12px 14px",
    }}
  >
    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
      {label}
    </div>
    <div
      style={{
        fontSize: 20,
        fontWeight: 500,
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {value}
    </div>
    {unit && (
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
        {unit}
      </div>
    )}
  </div>
);
