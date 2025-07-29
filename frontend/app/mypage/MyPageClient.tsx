"use client";

import { getMyProfile } from "@/libs/api/mypage.api";
import { useUserStore } from "@/store/userStore";
import type { Tab, UserProfileDto } from "@/types/api/mypage.types";
import { useEffect, useState } from "react";
import styles from "./MyPageLayout.module.css";
import PanelRouter from "./components/PanelRouter";
import SidebarNav from "./components/SidebarNav";


function MyPageSkeleton() {
  return (
    <div className={styles.mypageGridLayout} aria-busy="true">
      <aside className={styles.mypageSidebarWrap}>
        <div className={styles.sidebarSkeleton} />
      </aside>
      <main className={styles.mypagePanelWrap}>
        <div className={styles.panelSkeleton} />
      </main>
    </div>
  );
}

function MyPageError({ retry }: { retry: () => void }) {
  return (
    <div className={styles.mypageLoading} role="alert">
      데이터를 불러오지 못했습니다.
      <button className={styles.retryBtn} onClick={retry}>
        다시 시도
      </button>
    </div>
  );
}

export default function MyPageClient() {
  const { user, setUser, clearUser } = useUserStore();
  const [tab, setTab] = useState<Tab>("score");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userId, setUserId] = useState<number | null | undefined>(undefined);

  // CSR에서 localStorage에서 userId 읽기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userId");
      setUserId(stored ? Number(stored) : null);
    }
  }, []);

  // userId 있을 때만 fetch
  useEffect(() => {
    if (!user && userId !== undefined && userId !== null) {
      setIsLoading(true);
      getMyProfile(userId)
        .then((u) => {
          setUser(u);
          setIsError(false);
        })
        .catch(() => {
          clearUser();
          setIsError(true);
        })
        .finally(() => setIsLoading(false));
    } else if (userId !== undefined) {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [userId]);

  const handleRetry = () => {
    if (!userId) return;
    setIsLoading(true);
    setIsError(false);
    getMyProfile(userId)
      .then((u) => {
        setUser(u);
        setIsError(false);
      })
      .catch(() => {
        clearUser();
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };

  if (userId === undefined) return null;
  if (userId === null) return <div>로그인이 필요합니다.</div>;
  if (isLoading) return <MyPageSkeleton />;
  if (isError || !user) return <MyPageError retry={handleRetry} />;

  return (
    <div className={styles.mypageGridLayout} aria-label="마이페이지 전체 레이아웃">
      <aside className={styles.mypageSidebarWrap}>
        <SidebarNav tab={tab} setTab={setTab} userRole={user.role} />
      </aside>
      <main className={styles.mypagePanelWrap} tabIndex={0}>
        <PanelRouter tab={tab} user={user as UserProfileDto} />
      </main>
    </div>
  );
}
