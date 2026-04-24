export type UserRecord = {
  employeeId: string;
  password: string;
  name: string;
  department: string;
};

export const DUMMY_USERS: UserRecord[] = [
  {
    employeeId: "00142",
    password: "password123",
    name: "田中 太郎",
    department: "営業部",
  },
  {
    employeeId: "00201",
    password: "pass456",
    name: "鈴木 花子",
    department: "人事部",
  },
];

export function findUser(
  employeeId: string,
  password: string,
): UserRecord | undefined {
  return DUMMY_USERS.find(
    (u) => u.employeeId === employeeId && u.password === password,
  );
}
