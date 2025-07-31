"use client";

import type { Tab, UserProfileDto } from "@/types/api/mypage.types"; // ✅ 타입은 무조건 types에서 import!
import { Suspense, lazy } from "react";
import styles from "../MyPageLayout.module.css";


// 동적 import (파일명은 실제 구조에 맞게)
const ProfileEditPanel = lazy(() => import("./ProfileEditPanel"));
const RegionScorePanel = lazy(() => import("./RegionScorePanel"));
const MyPostList = lazy(() => import("./MyPostList"));
const MyCommentList = lazy(() => import("./MyCommentList"));
const MySurveyAnswerList = lazy(() => import("./MySurveyAnswerList"));
const MyReportList = lazy(() => import("./MyReportList"));

interface PanelRouterProps {
  tab: Tab;
  user: UserProfileDto;
}

export default function PanelRouter({ tab, user }: PanelRouterProps) {
  // 각 패널 분기 (props 일치!)
  let panel: React.ReactNode = null;

  switch (tab) {
    case "edit":
      panel = <ProfileEditPanel user={user} />;
      break;
    case "score":
      panel = <RegionScorePanel user={user} />;
      break;
    case "posts":
      panel = <MyPostList />;
      break;
    case "comments":
      panel = <MyCommentList userId={user.id} />;
      break;
    case "surveys":
      panel = <MySurveyAnswerList userId={user.id} />;
      break;
    case "reports":
      panel = <MyReportList userId={user.id} />;
      break;
    default:
      panel = <div className={styles.mypageLoading}>패널을 찾을 수 없습니다.</div>;
  }

  // Suspense는 한 번만!
  return (
    <Suspense fallback={<div className={styles.mypageLoading}>패널 불러오는 중...</div>}>
      {panel}
    </Suspense>
  );
}
