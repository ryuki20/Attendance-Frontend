import React from "react";

type Props = {
  label: string;
  time?: string;
  variant: "in" | "out";
  onClick: () => void;
};

export const PunchButton: React.FC<Props> = ({
  label,
  time,
  variant,
  onClick,
}) => {
  const isIn = variant === "in";
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "14px 16px",
        borderRadius: 12,
        border: "0.5px solid var(--border)",
        background: "var(--surface)",
        cursor: "pointer",
        textAlign: "center",
        transition: "background 0.15s, transform 0.1s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = isIn
          ? "rgba(74,163,89,0.08)"
          : "rgba(220,76,76,0.08)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background =
          "var(--surface)")
      }
      onMouseDown={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)")
      }
      onMouseUp={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")
      }
    >
      <div
        style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: time
            ? "var(--text-primary)"
            : isIn
              ? "var(--green)"
              : "var(--red)",
          fontFamily: time ? "var(--font-mono)" : "inherit",
        }}
      >
        {time ?? (isIn ? "出勤打刻" : "退勤打刻")}
      </div>
    </button>
  );
};
