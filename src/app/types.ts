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

export type ApplicationType = "ATTENDANCE_CORRECTION";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApplicationDetails = {
  date: string;
  requested_clock_in: string | null;
  requested_clock_out: string | null;
};

export type Application = {
  id: string;
  employee: {
    id: string;
    name: string;
  };
  type: ApplicationType;
  status: ApplicationStatus;
  reason: string;
  details: ApplicationDetails;
  created_at: string;
  updated_at: string;
};

export type ApplicationDetail = Application & {
  approved_by: { id: string; name: string } | null;
  approved_at: string | null;
  admin_comment: string | null;
};

export type ApplicationListResponse = {
  applications: Application[];
  total: number;
  page: number;
  per_page: number;
};
