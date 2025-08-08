'use client';

import { useReportStore } from '@/store/reportStore';
import styles from './ReportPopup.module.css';
import { useState } from 'react';

export default function ReportPopup() {
  const { isOpen, reportType, targetId, details, closeReportModal } = useReportStore();
  const [reason, setReason] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    // TODO: API 호출 로직 구현
    console.log(`신고 대상: ${reportType}, ID: ${targetId}`);
    console.log(`상세 정보:`, details);
    console.log(`신고 사유: ${reason}`);
    alert('신고가 접수되었습니다.');
    setReason('');
    closeReportModal();
  };

  // 신고 대상 정보를 동적으로 렌더링하는 함수
  const renderTargetInfo = () => {
    if (!details) return null;

    switch (reportType) {
      case 'POST':
        return (
          <div className={styles.targetInfo}>
            <p><strong>글 제목:</strong> {details.title || '정보 없음'}</p>
            <p><strong>작성자:</strong> {details.authorName || '정보 없음'}</p>
          </div>
        );
      case 'COMMENT':
        return (
          <div className={styles.targetInfo}>
            <p><strong>댓글 내용:</strong> {details.content || '정보 없음'}</p>
            <p><strong>작성자:</strong> {details.authorName || '정보 없음'}</p>
          </div>
        );
      // 다른 타입(USER, POLICY 등)에 대한 케이스도 추가 가능
      default:
        return <p>신고 대상 ID: {targetId}</p>;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>신고하기</h2>
        {renderTargetInfo()}
        <textarea
          className={styles.textarea}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="신고 사유를 입력해주세요..."
        />
        <div className={styles.buttons}>
          <button onClick={closeReportModal} className={styles.cancelButton}>
            취소
          </button>
          <button onClick={handleSubmit} className={styles.submitButton}>
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}
