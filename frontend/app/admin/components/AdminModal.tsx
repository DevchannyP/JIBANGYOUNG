import React from "react";
import styles from "../AdminPage.module.css";

export type ModalButton = {
  label: string;
  onClick: () => void;
  type?: "primary" | "secondary" | "danger" | "info" | "warning";
};

interface CommonModalProps {
  title: string;
  content: React.ReactNode;
  buttons: ModalButton[];
  onClose: () => void;
}

export function CommonModal({
  title,
  content,
  buttons,
  onClose,
}: CommonModalProps) {
  // ESC 누르면 모달 닫기 지원 (접근성)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // 오버레이 클릭 시 닫기 (배경 클릭 닫기)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalBody}>{content}</div>
        <div className={styles.modalActions}>
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={
                btn.type === "primary"
                  ? styles.primaryButton
                  : btn.type === "danger"
                    ? styles.dangerButton
                    : styles.defaultButton
              }
              type="button"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
