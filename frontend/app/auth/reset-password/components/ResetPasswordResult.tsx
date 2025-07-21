"use client";

interface Props {
  status: "success" | "error";
  message: string;
}

export default function ResetPasswordResult({ status, message }: Props) {
  return (
    <div
      style={{
        padding: 48,
        textAlign: "center",
        maxWidth: 420,
        margin: "0 auto",
        marginTop: 60,
        background: "#fffef7",
        borderRadius: 20,
        boxShadow: "0 5px 32px 0 #ffe14035",
        border:
          status === "success" ? "2.2px solid #e1ffdc" : "2.2px solid #ffdada",
        transition: "box-shadow 0.16s, border 0.18s",
        outline: "none",
      }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
    >
      <h2
        style={{
          color: status === "success" ? "#388e3c" : "#d32f2f",
          marginBottom: 16,
          fontWeight: 800,
          fontSize: "1.4rem",
          letterSpacing: "-1.5px",
        }}
      >
        {status === "success" ? "✅ 비밀번호 변경 완료" : "❌ 오류"}
      </h2>
      <div
        style={{
          marginTop: 16,
          marginBottom: 34,
          fontSize: 18,
          color: "#333",
          fontWeight: 600,
          lineHeight: 1.6,
        }}
      >
        {message}
      </div>
      {status === "success" && (
        <a
          href="/auth/login"
          style={{
            marginTop: 22,
            display: "inline-block",
            background: "linear-gradient(90deg,#ffe140 30%,#fff26c 100%)",
            color: "#232323",
            padding: "18px 40px",
            borderRadius: 14,
            fontWeight: 800,
            fontSize: "1.16rem",
            textDecoration: "none",
            boxShadow: "0 5px 28px 0 #ffe14055",
            letterSpacing: "-1px",
            border: "none",
            transition:
              "background 0.18s, box-shadow 0.18s, color 0.13s, transform 0.13s",
            outline: "none",
            cursor: "pointer",
          }}
          aria-label="로그인 페이지로 이동"
          tabIndex={0}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          로그인하러 가기
        </a>
      )}
      {/* 버튼 효과 및 진동 */}
      <style>{`
        a[aria-label="로그인 페이지로 이동"]:focus-visible {
          outline: 3px solid #3884e3;
        }
        a[aria-label="로그인 페이지로 이동"]:active {
          background: #ffe140;
          color: #d32f2f;
        }
      `}</style>
    </div>
  );
}
