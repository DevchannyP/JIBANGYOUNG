import { Suspense } from "react";
import RegionSelector from "../components/RegionSelector";
import PopularPostCards from "../[regionCode]/components/PopularPostCards";
import BoardNavigation from "../[regionCode]/components/BoardHeader";
import styles from "../[regionCode]/components/BoardList.module.css";
import WritePageClient from "./WritePageClient";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.regionTitle}>
        <h1>글작성</h1>
      </div>
      <RegionSelector />
      <PopularPostCards />
      <BoardNavigation />
      <Suspense fallback={<div>로딩 중...</div>}>
        <WritePageClient />
      </Suspense>
    </div>
  );
}
