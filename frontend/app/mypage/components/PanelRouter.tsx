"use client";

import type { UserProfileDto } from "@/libs/api/mypage.api";
import { Suspense, lazy } from "react";
import styles from "../MyPageLayout.module.css";
import type { Tab } from "./SidebarNav";

// 패널 동적 import (SSR 미포함)
const ProfileEditPanel = lazy(() => import("./ProfileEditPanel"));
const RegionScorePanel = lazy(() => import("./RegionScorePanel"));
const MyPostList = lazy(() => import("./MyPostList"));
const MyCommentList = lazy(() => import("./MyCommentList"));
const MySurveyHistoryList = lazy(() => import("./MySurveyHistoryList"));
const SurveyFavoritesPanel = lazy(() => import("./SurveyFavoritesPanel"));
const MyAlertList = lazy(() => import("./MyAlertList"));

// 통합 Props 타입 정의
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
        // 👇 userId 명시적으로 전달!
        return <MyCommentList userId={user.id} />;
      case "surveys":
        return <MySurveyHistoryList />;
      case "favorites":
        return <SurveyFavoritesPanel />;
      case "alerts":
        return <MyAlertList userId={user.id} />;
      default:
        return (
          <div className={styles.mypageLoading}>패널을 찾을 수 없습니다.</div>
        );
    }
  };

  return (
    <Suspense
      fallback={<div className={styles.mypageLoading}>패널 불러오는 중...</div>}
    >
      {renderPanel()}
    </Suspense>
  );
}
