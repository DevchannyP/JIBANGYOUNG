"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../FindIdPage.module.css";

interface Props {
  username: string;
  open: boolean;
  onClose: () => void;
}
// 아이디 찾기 성공 모달 컴포넌트
export default function FindIdSuccessModal({ username, open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 마운트 시점 확인 (SSR-safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && closeRef.current) closeRef.current.focus();
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  // 항상 body에 Portal로 띄우기 (모든 z-index 위에!)
  return createPortal(
    <AnimatePresence>
      <motion.div
        className={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(20, 20, 20, 0.38)",
          zIndex: 3000, // z-index 확실하게 최상위!
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(1.5px)",
          WebkitBackdropFilter: "blur(1.5px)",
        }}
      >
        <motion.div
          className={styles.resultContainer}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          style={{
            maxWidth: 380, padding: "36px 24px 32px 24px",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)",
            border: "1.5px solid #ffdf39"
          }}
        >
          <div className={styles.successIcon} aria-hidden>
            <span role="img" aria-label="성공">🎉</span>
          </div>
          <div className={styles.resultTitle}>
            아이디 찾기 완료!
          </div>
          <div className={styles.resultCard}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>아이디</span>
              <span className={styles.resultValue}>{username}</span>
            </div>
            <div style={{ fontSize: "0.98rem", color: "#666", marginTop: 12, textAlign: "center" }}>
              <b>회원님의 아이디</b>입니다.<br />
              로그인 페이지로 이동 후 <b>아이디/비밀번호</b>로 로그인하세요.
            </div>
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.loginButton}
              style={{ minWidth: 120, marginRight: 6 }}
              onClick={() => router.push("/auth/login")}
              type="button"
            >
              로그인하기
            </button>
            <button
              ref={closeRef}
              className={styles.retryButton}
              style={{ minWidth: 98 }}
              onClick={onClose}
              type="button"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
