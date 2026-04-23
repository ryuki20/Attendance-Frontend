export type PunchRecord = {
  in?: string; // 出勤時刻 "09:00"
  out?: string; // 退勤時刻 "18:00"
  break?: number; // 休憩時間（分）例: 60
  overtime?: number; // 残業時間（分）例: 30
};

export interface Records {
  [key: string]: PunchRecord;
}
export interface AuthUser {
  token: string;
  user: User;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}
