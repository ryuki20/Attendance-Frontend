export type PunchRecord = {
  in?: string; // 出勤時刻 "09:00"
  out?: string; // 退勤時刻 "18:00"
  break?: number; // 休憩時間（分）例: 60
  overtime?: number; // 残業時間（分）例: 30
};

export type Records = Record<string, PunchRecord>;

export type User = {
  name: string;
  department: string;
  employeeId: string;
};

export type AuthUser = {
  employeeId: string;
  name: string;
  department: string;
};
