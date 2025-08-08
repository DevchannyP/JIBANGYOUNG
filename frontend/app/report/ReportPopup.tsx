"use client";

import { createReport, CreateReportRequest } from "@/libs/api/community/community.api";
import { useReportStore } from "@/store/reportStore";
import { useState } from "react";
import styles from "./ReportPopup.module.css";

type ReasonCode =
  | "ABUSE"
  | "AD"
  | "COPYRIGHT"
  | "ETC"
  | "HATE"
  | "PERSONAL"
  | "SEXUAL"
  | "SPAM";

const REASON_OPTIONS: { code: ReasonCode; label: string }[] = [
  { code: "ABUSE", label: "욕설/비방/폭언" },
  { code: "AD", label: "광고/홍보" },
  { code: "COPYRIGHT", label: "저작권 침해" },
  { code: "ETC", label: "기타 부적절한 내용" },
  { code: "HATE", label: "혐오/차별" },
  { code: "PERSONAL", label: "개인정보 노출" },
  { code: "SEXUAL", label: "음란/선정성" },
  { code: "SPAM", label: "도배/스팸" },
];

const TARGET_TYPE_LABELS = {
  POST: "게시글",
  COMMENT: "도시",
  USER: "정착민",
  POLICY: "게시글",
  ETC: "기타",
};

export default function ReportPopup() {
  const { isOpen, reportType, targetId, details, closeReportModal } =
    useReportStore();
  const [selectedReason, setSelectedReason] = useState<ReasonCode | "">("");
  const [reasonDetail, setReasonDetail] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    if (!reportType || !targetId) {
      alert("신고 대상 정보가 없습니다.");
      return;
    }

    try {
      const reportRequest: CreateReportRequest = {
        targetType: reportType as CreateReportRequest["targetType"],
        targetId: Number(targetId),
        reasonCode: selectedReason,
        reasonDetail: reasonDetail || undefined,
      };

      await createReport(reportRequest);
      alert("신고가 접수되었습니다.");
      setSelectedReason("");
      setReasonDetail("");
      closeReportModal();
    } catch (error) {
      console.error("신고 접수 중 오류 발생:", error);
      alert(error instanceof Error ? error.message : "신고 접수에 실패했습니다.");
    }
  };

  const renderTargetInfo = () => {
    if (!details) return null;

    switch (reportType) {
      case "POST":
        return (
          <div className={styles.targetInfo}>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>제목</span>
              <span className={styles.targetValue}>
                {details.title || "정보 없음"}
              </span>
            </div>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>작성자</span>
              <span className={styles.targetValue}>
                {details.authorName || "정보 없음"}
              </span>
            </div>
          </div>
        );
      case "COMMENT":
        return (
          <div className={styles.targetInfo}>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>댓글 내용:</span>
              <span className={styles.targetValue}>
                {details.content || "정보 없음"}
              </span>
            </div>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>작성자:</span>
              <span className={styles.targetValue}>
                {details.authorName || "정보 없음"}
              </span>
            </div>
          </div>
        );
      case "USER":
        return (
          <div className={styles.targetInfo}>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>사용자명:</span>
              <span className={styles.targetValue}>
                {details.userName || details.authorName || "정보 없음"}
              </span>
            </div>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>사용자 ID:</span>
              <span className={styles.targetValue}>
                {details.userId || targetId || "정보 없음"}
              </span>
            </div>
          </div>
        );
      case "POLICY":
        return (
          <div className={styles.targetInfo}>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>정책명:</span>
              <span className={styles.targetValue}>
                {details.title || details.policyName || "정보 없음"}
              </span>
            </div>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>정책 ID:</span>
              <span className={styles.targetValue}>
                {targetId || "정보 없음"}
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.targetInfo}>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>신고 대상:</span>
              <span className={styles.targetValue}>
                {targetId || "정보 없음"}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚠ 신고</h2>
          <button onClick={closeReportModal} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.categoryInfo}>
            <div className={styles.categoryLabel}>
              <span className={styles.categoryBadge}>
                {TARGET_TYPE_LABELS[
                  reportType as keyof typeof TARGET_TYPE_LABELS
                ] || "기타"}
              </span>
            </div>
          </div>
          {renderTargetInfo()}
        </div>

        <div className={styles.reasonSection}>
          <h3 className={styles.sectionTitle}>신고 사유</h3>
          <div className={styles.reasonOptions}>
            {REASON_OPTIONS.map((option) => (
              <label key={option.code} className={styles.reasonOption}>
                <input
                  type="radio"
                  name="reportReason"
                  value={option.code}
                  checked={selectedReason === option.code}
                  onChange={(e) =>
                    setSelectedReason(e.target.value as ReasonCode)
                  }
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.detailSection}>
          <textarea
            className={styles.textarea}
            value={reasonDetail}
            onChange={(e) => setReasonDetail(e.target.value)}
            placeholder="신고 사유"
          />
        </div>

        <div className={styles.buttons}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            신고하기
          </button>
          <button onClick={closeReportModal} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
