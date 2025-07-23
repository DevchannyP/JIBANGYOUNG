"use client";

import { useState } from "react";
import { useUser } from "../../libs/hooks/useUser";
import styles from "./components/MyPageLayout.module.css";

import EditUserInfoForm from "./components/EditUserInfoForm";
import MyAlertList from "./components/MyAlertList";
import MyCommentList from "./components/MyCommentList";
import MyInfoCard from "./components/MyInfoCard";
import MyPostList from "./components/MyPostList";
import MyReportList from "./components/MyReportList";
import MySurveyHistoryList from "./components/MySurveyHistoryList";
import RegionScorePanel from "./components/RegionScorePanel";
import SurveyFavoritesPanel from "./components/SurveyFavoritesPanel";

type Tab =
  | "score"
  | "posts"
  | "comments"
  | "surveys"
  | "favorites"
  | "alerts"
  | "reports"
  | "edit";

const TABS: { key: Tab; label: string }[] = [
  { key: "score", label: "지역별 점수" },
  { key: "posts", label: "내 게시글" },
  { key: "comments", label: "내 댓글보기" },
  { key: "surveys", label: "내 설문 이력" },
  { key: "favorites", label: "관심지역 알림" },
  { key: "alerts", label: "내 신고이력" },
  { key: "reports", label: "멘토신청/멘토 공지사항" },
  { key: "edit", label: "찜 정책" },
];

export default function MyPageClient() {
  const { data: user, isLoading } = useUser();
  const [tab, setTab] = useState<Tab>("score");

  if (isLoading || !user) {
    return <div className={styles.mypageLoading}>로딩중...</div>;
  }

  return (
    <div className={styles.mypageGridLayoutReversed}>
      {/* 왼쪽: 프로필 카드 + 콘텐츠 패널 */}
      <main className={styles.mypageLeftPanel}>
        <MyInfoCard user={user} />
        {tab === "score" && <RegionScorePanel user={user} />}
        {tab === "posts" && <MyPostList />}
        {tab === "comments" && <MyCommentList />}
        {tab === "surveys" && <MySurveyHistoryList />}
        {tab === "favorites" && <SurveyFavoritesPanel />}
        {tab === "alerts" && <MyAlertList userId={user.id} />}
        {tab === "reports" && <MyReportList userId={user.id} />}
        {tab === "edit" && <EditUserInfoForm user={user} />}
      </main>

      {/* 오른쪽: 사이드바 메뉴만 */}
      <aside className={styles.mypageRightSidebar}>
        <nav className={styles.mypageSidebar} aria-label="마이페이지 메뉴">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.mypageSidebarLink} ${
                tab === t.key ? styles.active : ""
              }`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}
