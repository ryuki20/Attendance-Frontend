"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "社員一覧", href: "/admin" },
    { label: "申請一覧", href: "/admin/requests" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <aside
        style={{
          width: 200,
          background: "var(--surface)",
          borderRight: "0.5px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
        }}
      >
        <div
          style={{
            padding: "0 20px 24px",
            borderBottom: "0.5px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            管理者メニュー
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "0 12px" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "0.5px solid var(--border)",
              background: "var(--blue)",
              fontSize: 13,
              color: "#fff",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            ← マイページ
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "32px" }}>{children}</main>

      <style>{`
        :root {
          --bg: #f5f4f1; --surface: #ffffff;
          --border: rgba(0,0,0,0.1); --border-strong: rgba(0,0,0,0.2);
          --text-primary: #1a1a18; --text-muted: #6b6a65;
          --blue: #185fa5; --green: #3b6d11; --red: #a32d2d;
          --font-sans: 'Helvetica Neue', Arial, sans-serif;
          --font-mono: 'SF Mono', 'Fira Code', monospace;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #18181a; --surface: #222224;
            --border: rgba(255,255,255,0.1); --border-strong: rgba(255,255,255,0.22);
            --text-primary: #f0efe9; --text-muted: #8a8980;
            --blue: #6fa8e8; --green: #7ec850; --red: #e06060;
          }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; }
        button { font-family: inherit; }
        .nav-link {
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-muted);
          background: transparent;
          text-decoration: none;
          margin-bottom: 4px;
          font-weight: 400;
        }
        .nav-link.active {
          color: var(--blue);
          background: rgba(24,95,165,0.08);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
