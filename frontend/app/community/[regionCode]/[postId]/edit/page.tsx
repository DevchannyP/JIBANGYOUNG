import { Suspense } from "react";
import RegionSelector from "../../../components/RegionSelector";
import PopularPostCards from "../../components/PopularPostCards";
import BoardNavigation from "../../components/BoardHeader";
import styles from "../../components/BoardList.module.css";
import EditPageClient from "./EditPageClient";

interface Props {
  params: Promise<{
    regionCode: string;
    postId: string;
  }>;
}

export default async function EditPage({ params }: Props) {
  const { regionCode, postId } = await params;

  return (
    <div className={styles.container}>
      <div className={styles.regionTitle}>
        <h1>글 수정</h1>
      </div>
      <RegionSelector />
      <PopularPostCards />
      <BoardNavigation />
      <Suspense fallback={<div>로딩 중...</div>}>
        <EditPageClient regionCode={regionCode} postId={postId} />
      </Suspense>
    </div>
  );
}