import { Suspense } from "react";
import MentorNoticeDetail from "./components/MentorNoticeDetail";
import styles from "./MentorNoticeDetail.module.css";

interface Props {
  params: Promise<{
    noticeId: string;
  }>;
}

export default async function MentorNoticeDetailPage({ params }: Props) {
  const { noticeId } = await params;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>멘토 공지</h1>
        <hr className={styles.divider} />
      </div>

      <Suspense fallback={<div>공지사항을 불러오는 중...</div>}>
        <MentorNoticeDetail noticeId={Number(noticeId)} />
      </Suspense>
    </div>
  );
}
