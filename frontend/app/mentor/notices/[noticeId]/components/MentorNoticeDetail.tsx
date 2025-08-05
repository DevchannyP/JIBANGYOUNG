"use client";

import type { MentorNoticeNavigation } from "@/libs/api/mentor/mentor.api";
import { getMentorNoticeDetail } from "@/libs/api/mentor/mentor.api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../MentorNoticeDetail.module.css";

interface Props {
  noticeId: number;
}

export default function MentorNoticeDetail({ noticeId }: Props) {
  const router = useRouter();
  const [noticeData, setNoticeData] = useState<MentorNoticeNavigation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await getMentorNoticeDetail(noticeId);
        console.log("API 응답 데이터:", data); // 디버깅용
        setNoticeData(data);
      } catch (error) {
        console.error("공지사항을 불러오지 못했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

  const handleBack = () => {
    router.back();
  };

  const handleNavigation = (targetId: number) => {
    router.push(`/mentor/notices/${targetId}`);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>로딩 중...</div>;
  }

  if (!noticeData || !noticeData.current) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>공지사항을 찾을 수 없습니다.</div>;
  }

  const { current: notice, previous, next } = noticeData;

  return (
    <div>
      <div className={styles.noticeHeader}>
        <h2 className={styles.noticeTitle}>{notice?.title || "제목 없음"}</h2>
        
        <div className={styles.noticeInfo}>
          <span className={styles.regionBadge}>
            {notice?.regionName || "LV4 관리자"}
          </span>
          <span>📅 {notice?.createdAt || "날짜 없음"}</span>
        </div>
      </div>

      <div className={styles.noticeContent}>
        <div 
          dangerouslySetInnerHTML={{ __html: notice?.content || "내용 없음" }}
          style={{ lineHeight: '1.6' }}
        />
      </div>

      <hr className={styles.divider} />

      <div className={styles.commentsSection}>
        {/* 네비게이션 영역 */}
        {next && next.id && next.title && (
          <>
            <div className={styles.navigationItem}>
              <span className={styles.navigationLabel}>다음글</span>
              <button 
                className={styles.navigationButton}
                onClick={() => handleNavigation(next.id)}
              >
                {next.title}
              </button>
            </div>
            <hr style={{ margin: '1rem 0', border: 'none', height: '1px', backgroundColor: '#eee' }} />
          </>
        )}

        {previous && previous.id && previous.title && (
          <>
            <div className={styles.navigationItem}>
              <span className={styles.navigationLabel}>이전글</span>
              <button 
                className={styles.navigationButton}
                onClick={() => handleNavigation(previous.id)}
              >
                {previous.title}
              </button>
            </div>
            <hr style={{ margin: '1rem 0', border: 'none', height: '1px', backgroundColor: '#eee' }} />
          </>
        )}

        <div className={styles.commentActions}>
          <button className={styles.submitButton}>
            수정
          </button>
          <button className={styles.cancelButton} onClick={handleBack}>
            목록
          </button>
        </div>
      </div>
    </div>
  );
}