"use client";
import { AdminGuard } from "@/src/app/components/AdminGuard";
import { apiFetch } from "@/src/app/lib/api";
import type {
  ApplicationDetail,
  ApplicationStatus,
  Employee,
} from "@/src/app/types";
import { isoToHHMM } from "@/src/app/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "申請中",
    color: "var(--amber)",
    bg: "rgba(133,81,11,0.1)",
  },
  APPROVED: {
    label: "承認済み",
    color: "var(--green)",
    bg: "rgba(59,109,17,0.1)",
  },
  REJECTED: { label: "却下", color: "var(--red)", bg: "rgba(163,45,45,0.1)" },
};

function RequestDetail({}: { employee: Employee }) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminComment, setAdminComment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/admin/applications/${id}`);
        if (!res.ok) throw new Error("取得失敗");
        const data: ApplicationDetail = await res.json();
        setDetail(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAction = async (action: "approve" | "reject") => {
    setProcessing(true);
    setError("");
    try {
      const res = await apiFetch(`/admin/applications/${id}/${action}`, {
        method: "PATCH",
        body: JSON.stringify({
          admin_comment: adminComment || null,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.error ?? "処理に失敗しました");
        return;
      }

      setDetail(data as ApplicationDetail);
    } catch (e) {
      setError("通信エラーが発生しました");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 0",
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        読み込み中...
      </div>
    );
  }

  if (!detail) return null;

  const status = STATUS_CONFIG[detail.status as ApplicationStatus];
  const isPending = detail.status === "PENDING";

  return (
    <div style={{ maxWidth: 600 }}>
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
          onClick={() => router.push("/admin/requests")}
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← 申請一覧
        </button>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          申請詳細
        </h1>
      </div>

      {/* 申請情報カード */}
      <div
        style={{
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <Row label="社員名">{detail.employee.name}</Row>
          <Row label="ステータス">
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 4,
                color: status.color,
                background: status.bg,
              }}
            >
              {status.label}
            </span>
          </Row>
          <Row label="対象日">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
              {detail.details.date}
            </span>
          </Row>
          <Row label="修正出勤">
            <span
              style={{ fontFamily: "var(--font-mono)", color: "var(--green)" }}
            >
              {isoToHHMM(detail.details.requested_clock_in) ?? "--"}
            </span>
          </Row>
          <Row label="修正退勤">
            <span
              style={{ fontFamily: "var(--font-mono)", color: "var(--red)" }}
            >
              {isoToHHMM(detail.details.requested_clock_out) ?? "--"}
            </span>
          </Row>
          <Row label="申請理由">{detail.reason}</Row>
          <Row label="申請日">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
              {detail.created_at.slice(0, 10)}
            </span>
          </Row>

          {/* 承認済み・却下済みの場合は承認者情報を表示 */}
          {detail.approved_by && (
            <Row label="処理者">{detail.approved_by.name}</Row>
          )}
          {detail.approved_at && (
            <Row label="処理日">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                {detail.approved_at.slice(0, 10)}
              </span>
            </Row>
          )}
          {detail.admin_comment && (
            <Row label="管理者コメント">{detail.admin_comment}</Row>
          )}
        </div>
      </div>

      {/* 承認・却下フォーム（申請中のみ表示） */}
      {isPending && (
        <div
          style={{
            background: "var(--surface)",
            border: "0.5px solid var(--border)",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            承認・却下
          </div>

          {/* 管理者コメント */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 6,
                display: "block",
              }}
            >
              管理者コメント（任意）
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              rows={3}
              placeholder="コメントを入力してください"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "0.5px solid var(--border)",
                background: "var(--surface-muted)",
                fontSize: 13,
                color: "var(--text-primary)",
                resize: "vertical",
              }}
            />
          </div>

          {/* エラー */}
          {error && (
            <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>
              {error}
            </p>
          )}

          {/* ボタン */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleAction("approve")}
              disabled={processing}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                border: "none",
                background: processing ? "var(--border)" : "var(--green)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                cursor: processing ? "not-allowed" : "pointer",
              }}
            >
              {processing ? "処理中..." : "承認"}
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={processing}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                border: "none",
                background: processing ? "var(--border)" : "var(--red)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                cursor: processing ? "not-allowed" : "pointer",
              }}
            >
              {processing ? "処理中..." : "却下"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 行表示用の共通コンポーネント
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
        {children}
      </span>
    </div>
  );
}

export default function RequestDetailPage() {
  return (
    <AdminGuard>
      {(employee) => <RequestDetail employee={employee} />}
    </AdminGuard>
  );
}
