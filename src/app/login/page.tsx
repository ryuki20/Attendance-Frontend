"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { AuthEmployee } from "../types";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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

      login(data.employee, data.token);
      router.push("/");
    } catch (e) {
      setError("通信エラーが発生しました");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        fontFamily: "var(--font-sans)",
        padding: "16px",
      }}
    >
      {/* カード */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 16,
          padding: "40px 32px",
        }}
      >
        {/* ヘッダー */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(24,95,165,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              margin: "0 auto 16px",
            }}
          >
            🏢
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            勤怠管理システム
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            アカウント情報でログインしてください
          </p>
        </div>

        {/* フォーム */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* メールアドレス */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="yamada@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "0.5px solid var(--border)",
                background: "var(--surface-muted)",
                fontSize: 13,
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          {/* パスワード */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="パスワードを入力"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "0.5px solid var(--border)",
                background: "var(--surface-muted)",
                fontSize: 13,
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(163,45,45,0.08)",
                border: "0.5px solid rgba(163,45,45,0.2)",
                fontSize: 12,
                color: "var(--red)",
              }}
            >
              {error}
            </div>
          )}

          {/* ログインボタン */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 8,
              border: "none",
              background: loading ? "var(--border)" : "var(--blue)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4,
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </div>
      </div>

      {/* CSS変数 */}
      <style>{`
      :root {
        --bg: #f5f4f1;
        --surface: #ffffff;
        --surface-muted: #f0efe9;
        --border: rgba(0,0,0,0.1);
        --text-primary: #1a1a18;
        --text-muted: #6b6a65;
        --blue: #185fa5;
        --red: #a32d2d;
        --font-sans: 'Helvetica Neue', Arial, sans-serif;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #18181a;
          --surface: #222224;
          --surface-muted: #2a2a2c;
          --border: rgba(255,255,255,0.1);
          --text-primary: #f0efe9;
          --text-muted: #8a8980;
          --blue: #6fa8e8;
          --red: #e06060;
        }
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      input::placeholder { color: var(--text-muted); opacity: 0.6; }
      button { font-family: inherit; }
    `}</style>
    </div>
  );
}
