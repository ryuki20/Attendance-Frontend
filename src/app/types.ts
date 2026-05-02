export type AttendanceResponse = {
  id: string;
  employee_id: string;
  clock_in?: string | null; // "2024-01-01T09:00:00+09:00"
  clock_out?: string | null; // "2024-01-01T09:00:00+09:00"
  date: string;
  created_at: string;
  updated_at: string;
};

export type AuthEmployee = {
  token: string;
  employee: Employee;
};
export type Employee = {
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

export type RequestType = "paid_leave" | "correction";

export type RequestStatus = "pending" | "approved" | "rejected";

export type AttendanceRequest = {
  id: string;
  employee_id: string;
  type: RequestType;
  status: RequestStatus;
  date: string;
  reason: string;
  created_at: string;
  updated_at: string;
};

export type CorrectionDetail = {
  request_id: string;
  before_clock_in?: string;
  before_clock_out?: string;
  after_clock_in?: string;
  after_clock_out?: string;
};

export type EmployeeListResponse = {
  employees: Employee[];
  total: number;
  page: number;
  per_page: number;
};

export type EmployeeDetailResponse = {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
  attendances: {
    records: AttendanceResponse[];
  };
};
