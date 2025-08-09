"use client";

import type { MentorNoticeNavigation } from "@/libs/api/mentor/mentor.api";
import { getMentorNoticeDetail } from "@/libs/api/mentor/mentor.api";
import { regionFullPath } from "@/components/constants/region-map";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../MentorNoticeDetail.module.css";

interface Props {
  noticeId: number;
}

export default function MentorNoticeDetail({ noticeId }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [noticeData, setNoticeData] = useState<MentorNoticeNavigation | null>(null);
  const [loading, setLoading] = useState(true);

  // 멘토 권한 체크
  const isMentor = user?.role && ['MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN'].includes(user.role);

  // 멘토가 아닌 경우 접근 차단
  useEffect(() => {
    if (user && !isMentor) {
      alert("멘토 권한이 필요합니다.");
      router.push("/dashboard");
      return;
    }
  }, [user, isMentor, router]);

  useEffect(() => {
    if (!user || !isMentor) return;
    
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
  }, [noticeId, user, isMentor]);

  const handleBack = () => {
    router.back();
  };

  const handleNavigation = (targetId: number) => {
    router.push(`/mentor/notices/${targetId}`);
  };

  // 권한 체크
  if (!user) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>로그인이 필요합니다.</div>;
  }

  if (!isMentor) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>멘토 권한이 필요합니다.</div>;
  }

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
            {notice?.regionCode === "99999" ? "전국" : regionFullPath(notice?.regionCode)}
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