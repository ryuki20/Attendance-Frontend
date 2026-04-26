"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthEmployee } from "../types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("社員IDまたはパスワードが正しくありません");
        return;
      }

      const data: AuthEmployee = await response.json();
      console.log("APIレスポンス:", data);

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("AuthEmployee", JSON.stringify(data.user));

      router.push("/");
    } catch (e) {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      {error && <p>{error}</p>}
      <label>メールアドレス</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>パスワード</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "ログイン中..." : "ログイン"}
      </button>
    </div>
  );
}
