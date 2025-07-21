"use client";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { resetPassword } from "../../../../libs/api/auth/auth.api";

interface Props {
  token: string;
  onResult: (result: { status: "success" | "error"; message: string }) => void;
}

// 비밀번호 규칙 안내
function PasswordRules({ pw }: { pw: string }) {
  const rules = [
    { valid: pw.length >= 8, text: "8자 이상" },
    { valid: pw.length <= 64, text: "64자 이하" },
    { valid: /[A-Z]/.test(pw), text: "대문자 포함" },
    { valid: /[a-z]/.test(pw), text: "소문자 포함" },
    { valid: /[0-9]/.test(pw), text: "숫자 포함" },
    {
      valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
      text: "특수문자 포함",
    },
  ];
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "0 0 16px 0",
        fontSize: "1.02em",
        color: "#6c6c6c",
      }}
    >
      {rules.map((r, i) => (
        <li
          key={i}
          style={{
            color: r.valid ? "#147833" : "#d32f2f",
            fontWeight: r.valid ? 600 : 400,
            display: "inline-block",
            marginRight: 18,
            marginBottom: 2,
            transition: "color 0.18s",
          }}
        >
          {r.valid ? "●" : "○"} {r.text}
        </li>
      ))}
    </ul>
  );
}

export default function ResetPasswordForm({ token, onResult }: Props) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const pw2InputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const pwValid =
    pw.length >= 8 &&
    pw.length <= 64 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw);

  const pwMatch = pw === pw2 && pw2.length > 0;

  useEffect(() => {
    pwInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (err) {
      if (err.includes("일치")) pw2InputRef.current?.focus();
      else pwInputRef.current?.focus();
    }
  }, [err]);

  const mutation = useMutation({
    mutationFn: async () =>
      resetPassword({
        token,
        newPassword: pw,
        newPasswordConfirm: pw2,
      }),
    onSuccess: () => {
      onResult({
        status: "success",
        message: "비밀번호가 성공적으로 변경되었습니다!",
      });
      setPw("");
      setPw2("");
      setErr("");
    },
    onError: (e: any) => {
      setErr(e.message || "비밀번호 변경 실패");
      btnRef.current?.focus();
    },
  });

  const onPw2KeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      btnRef.current?.focus();
      e.preventDefault();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setErr("");
        if (!pwValid)
          return setErr(
            "비밀번호는 8~64자, 대소문자/숫자/특수문자를 모두 포함해야 합니다."
          );
        if (!pwMatch) return setErr("비밀번호가 일치하지 않습니다.");
        mutation.mutate();
      }}
      autoComplete="off"
      aria-describedby={err ? "pw-err" : undefined}
      style={{
        maxWidth: 410,
        margin: "0 auto",
        background: "#fffef7",
        borderRadius: 18,
        padding: "42px 30px 30px",
        boxShadow: "0 4px 32px 0 #ffe14029",
        transition: "box-shadow 0.18s",
      }}
    >
      <h2
        style={{
          marginBottom: 22,
          fontWeight: 700,
          color: "#147833",
          letterSpacing: "-1px",
          fontSize: "1.32rem",
        }}
      >
        새 비밀번호 재설정
      </h2>
      <label htmlFor="pw" style={{ display: "none" }}>
        새 비밀번호
      </label>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input
          ref={pwInputRef}
          id="pw"
          type={showPw ? "text" : "password"}
          placeholder="새 비밀번호"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr("");
          }}
          minLength={8}
          maxLength={64}
          autoComplete="new-password"
          required
          style={{
            marginBottom: 0,
            width: "100%",
            padding: "17px 50px 17px 18px",
            borderRadius: 12,
            fontSize: 18,
            border: `1.9px solid ${err && !pwValid ? "#d32f2f" : "#ececec"}`,
            boxShadow: err && !pwValid ? "0 0 0 2.5px #ffc4c4bb" : "none",
            fontWeight: 500,
            background: "#fff",
            transition: "border 0.18s, box-shadow 0.18s",
          }}
          aria-invalid={!pwValid}
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          tabIndex={0}
          aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
          style={{
            position: "absolute",
            right: 12,
            top: 14,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#bbb",
            fontSize: 20,
          }}
        >
          {showPw ? "🙈" : "👁️"}
        </button>
      </div>
      <PasswordRules pw={pw} />
      <label htmlFor="pw2" style={{ display: "none" }}>
        새 비밀번호 확인
      </label>
      <div style={{ position: "relative", marginBottom: 4 }}>
        <input
          ref={pw2InputRef}
          id="pw2"
          type={showPw2 ? "text" : "password"}
          placeholder="새 비밀번호 확인"
          value={pw2}
          onChange={(e) => {
            setPw2(e.target.value);
            setErr("");
          }}
          minLength={8}
          maxLength={64}
          autoComplete="new-password"
          required
          style={{
            marginBottom: 0,
            width: "100%",
            padding: "17px 50px 17px 18px",
            borderRadius: 12,
            fontSize: 18,
            border: `1.9px solid ${err && !pwMatch ? "#d32f2f" : "#ececec"}`,
            boxShadow: err && !pwMatch ? "0 0 0 2.5px #ffc4c4bb" : "none",
            fontWeight: 500,
            background: "#fff",
            transition: "border 0.18s, box-shadow 0.18s",
          }}
          aria-invalid={!pwMatch}
          onKeyDown={onPw2KeyDown}
        />
        <button
          type="button"
          onClick={() => setShowPw2((v) => !v)}
          tabIndex={0}
          aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 표시"}
          style={{
            position: "absolute",
            right: 12,
            top: 14,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#bbb",
            fontSize: 20,
          }}
        >
          {showPw2 ? "🙈" : "👁️"}
        </button>
      </div>
      {pw2.length > 0 && (
        <div
          style={{
            color: pwMatch ? "#147833" : "#d32f2f",
            fontWeight: 600,
            fontSize: "1.05em",
            marginBottom: 10,
            minHeight: 20,
            letterSpacing: "-0.5px",
          }}
          aria-live="polite"
        >
          {pwMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
        </div>
      )}
      <button
        ref={btnRef}
        type="submit"
        disabled={!pwValid || !pwMatch || mutation.isPending}
        aria-disabled={!pwValid || !pwMatch || mutation.isPending}
        style={{
          width: "100%",
          padding: "22px 0",
          marginTop: 14,
          marginBottom: 8,
          borderRadius: 15,
          background: "linear-gradient(90deg,#ffe140 20%,#fff26c 100%)",
          color: "#2c2c2c",
          fontWeight: 800,
          fontSize: "1.35rem",
          boxShadow: "0 3px 24px 0 #ffe14065",
          letterSpacing: "-0.5px",
          border: "none",
          cursor: !pwValid || !pwMatch ? "not-allowed" : "pointer",
          transition: "background 0.18s, box-shadow 0.18s, color 0.14s",
        }}
        aria-busy={mutation.isPending}
        className="pw-reset-btn"
      >
        {mutation.isPending ? (
          <span style={{ letterSpacing: 0 }}>
            <span
              className="loader"
              style={{
                display: "inline-block",
                width: 22,
                height: 22,
                marginRight: 10,
                verticalAlign: "-6px",
              }}
            ></span>
            변경중...
          </span>
        ) : (
          "비밀번호 변경"
        )}
      </button>
      <style>{`
        .pw-reset-btn:active {
          background: #ffe140;
          color: #d32f2f;
        }
        .pw-reset-btn:focus-visible {
          outline: 3px solid #3884e3;
        }
        .loader {
          border: 3px solid #ffe66b;
          border-top: 3px solid #3884e3;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
      <div
        id="pw-err"
        aria-live="assertive"
        role="alert"
        style={{
          color: "#d32f2f",
          marginTop: 14,
          minHeight: 26,
          fontSize: 16,
          fontWeight: 600,
          textAlign: "center",
          visibility: err ? "visible" : "hidden",
        }}
      >
        {err || "\u00A0"}
      </div>
    </form>
  );
}
