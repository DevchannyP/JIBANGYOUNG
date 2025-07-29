"use client";

import type { Tab, UserProfileDto } from "@/libs/api/mypage.api";
import { Suspense, lazy } from "react";
import styles from "../MyPageLayout.module.css";

// 패널 동적 import
const ProfileEditPanel = lazy(() => import("./ProfileEditPanel"));
const RegionScorePanel = lazy(() => import("./RegionScorePanel"));
const MyPostList = lazy(() => import("./MyPostList"));
const MyCommentList = lazy(() => import("./MyCommentList"));
const MySurveyAnswerList = lazy(() => import("./MySurveyAnswerList"));
const MyReportList = lazy(() => import("./MyReportList"));
// ✅ MyAlertList, alerts case 제거!

interface PanelRouterProps {
  tab: Tab;
  user: UserProfileDto;
}

export default function PanelRouter({ tab, user }: PanelRouterProps) {
  const renderPanel = () => {
    switch (tab) {
      case "edit":
        return <ProfileEditPanel user={user} />;
      case "score":
        return <RegionScorePanel user={user} />;
      case "posts":
        return <MyPostList />;
      case "comments":
        return <MyCommentList userId={user.id} />;
      case "surveys":
        return <MySurveyAnswerList userId={user.id} />;
      case "reports":
        return <MyReportList userId={user.id} />;
      default:
        return (
          <div className={styles.mypageLoading}>패널을 찾을 수 없습니다.</div>
        );
    }
  };

  return (
    <Suspense fallback={<div className={styles.mypageLoading}>패널 불러오는 중...</div>}>
      {renderPanel()}
    </Suspense>
  );
}
