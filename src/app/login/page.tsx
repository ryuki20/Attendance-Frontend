"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findUser } from "../data/users";
import type { AuthUser } from "../types";

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = findUser(employeeId, password);
    if (!user) {
      setError("社員IDまたはパスワードが正しくありません");
      return;
    }

    const authUser: AuthUser = {
      employeeId: user.employeeId,
      name: user.name,
      department: user.department,
    };
    sessionStorage.setItem("authUser", JSON.stringify(authUser));
    router.push("/");
  };

  return (
    <div>
      <h1>ログイン</h1>
      {error && <p>{error}</p>}
      <label>社員ID</label>
      <input
        type="text"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <label>パスワード</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
}
