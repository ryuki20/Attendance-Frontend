"use client";
import { AdminGuard } from "@/src/app/components/AdminGuard";
import { apiFetch } from "@/src/app/lib/api";
import type { Employee } from "@/src/app/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function NewEmployForm({}: { employee: Employee }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"employee" | "admin">("employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("名前・メールアドレス・パスワードは必須です");
      return;
    }
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "社員の作成に失敗しました");
        return;
      }

      router.push("/admin");
    } catch (e) {
      setError("通信エラーが発生しました");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "var(--text-muted)",
    marginBottom: 6,
    display: "block",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "0.5px solid var(--border)",
    background: "var(--surface-muted)",
    fontSize: 13,
    color: "var(--text-primary)",
  };

  return (
    <div style={{ maxWidth: 480 }}>
      {/* ページヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => router.push("/admin")}
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← 社員一覧
        </button>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          社員作成
        </h1>
      </div>

      {/* フォーム */}
      <div
        style={{
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          padding: 24,
          display: "grid",
          gap: 20,
        }}
      >
        {/* 名前 */}
        <div>
          <label style={labelStyle}>名前 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="山田 太郎"
            style={inputStyle}
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label style={labelStyle}>メールアドレス *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yamada@example.com"
            style={inputStyle}
          />
        </div>

        {/* パスワード */}
        <div>
          <label style={labelStyle}>パスワード * （6文字以上）</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上"
            style={inputStyle}
          />
        </div>

        {/* 権限 */}
        <div>
          <label style={labelStyle}>権限</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "employee" | "admin")}
            style={inputStyle}
          >
            <option value="employee">社員</option>
            <option value="admin">管理者</option>
          </select>
        </div>

        {/* エラー */}
        {error && <p style={{ fontSize: 12, color: "var(--red)" }}>{error}</p>}

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: loading ? "var(--border)" : "var(--blue)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "作成中..." : "社員を作成"}
        </button>
      </div>
    </div>
  );
}

export default function NewEmployPage() {
  return (
    <AdminGuard>
      {(employee) => <NewEmployForm employee={employee} />}
    </AdminGuard>
  );
}
