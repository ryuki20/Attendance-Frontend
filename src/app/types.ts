export type AttendanceResponse = {
  id: string;
  user_id: string;
  clock_in?: string | null; // "2024-01-01T09:00:00+09:00"
  clock_out?: string | null; // "2024-01-01T09:00:00+09:00"
  date: string;
  created_at: string;
  updated_at: string;
};

export type AuthUser = {
  token: string;
  user: User;
};
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type AttendanceRecord = {
  in?: string;
  out?: string;
};

export type AttendanceRecords = Record<string, AttendanceRecord>; // キー: "2024-01-01"
