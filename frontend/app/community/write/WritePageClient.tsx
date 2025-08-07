"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PopularPosts from "../[regionCode]/components/PopularPosts";
import styles from "../[regionCode]/components/BoardList.module.css";
import WriteForm from "./WriteForm";

export default function WritePageClient() {
  const searchParams = useSearchParams();
  const regionCode = searchParams.get("regionCode");

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <WriteForm />
        </Suspense>
      </div>
      <aside className={styles.sidebar}>
        {regionCode && <PopularPosts regionCode={regionCode} />}
      </aside>
    </main>
  );
}