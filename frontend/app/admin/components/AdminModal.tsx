"use client";

import React from "react";
import styles from "../AdminPage.module.css";

type ModalButton = {
  label: string;
  onClick: () => void;
  type?: "primary" | "secondary" | "danger";
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
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>
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
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
