import { AttendanceRecords, AttendanceResponse, Employee } from "./types";

export function dateKey(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export function fmtTime(d: Date): string {
  return [
    String(d.getHours()).padStart(2, "0"),
    String(d.getMinutes()).padStart(2, "0"),
  ].join(":");
}

export function calcHours(inT: string, outT: string): number {
  const [ih, im] = inT.split(":").map(Number);
  const [oh, om] = outT.split(":").map(Number);
  return (oh * 60 + om - (ih * 60 + im)) / 60;
}

export function parseKey(key: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = key.split("_").map(Number);
  return { year, month: month - 1, day };
}

/**
 * 分を "1h30m" / "60m" などの表示用文字列に変換
 * 例: 90 -> "1h30m",  60 -> "1h00m",  30 -> "30m",  0 -> "--"
 */
export function fmtMinutes(minutes: number | undefined): string {
  if (!minutes || minutes <= 0) return "--";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h${String(m).padStart(2, "0")}m`;
}

export function isoToHHMM(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  return [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
  ].join(":");
}

export function toRecords(
  attendances: AttendanceResponse[]
): AttendanceRecords {
  const records: AttendanceRecords = {};
  attendances.forEach((a) => {
    records[a.date] = {
      in: isoToHHMM(a.clock_in),
      out: isoToHHMM(a.clock_out),
    };
  });
  return records;
}

export type AuthEmployee = {
  token: string;
  employee: Employee;
};
