import { fetchPostDetail } from "@/libs/api/community/community.api";
import { Metadata } from "next";
import styles from "../../Community.module.css";
import RegionSelector from "../../components/RegionSelector";
import { DetailProps } from "../../types";
import PostDetail from "./PostDetail";

// ✅ SEO 메타데이터 - 구조 분해 + 인라인 타입
export async function generateMetadata({
  params,
}: {
  params: { regionCode: string };
}): Promise<Metadata> {
  const { regionCode } = await params;
  return {
    title: `${regionCode} 커뮤니티 - 지방청년`,
    description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    openGraph: {
      title: `${regionCode} 커뮤니티 - 지방청년`,
      description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    },
  };
}

// ✅ 게시글 상세 페이지 - 구조 분해 + 인라인 타입
export default async function CommunityPage({
  params,
}: {
  params: { regionCode: string; postId: string };
}) {
  const { regionCode, postId } = await params;
  const detail: DetailProps = await fetchPostDetail(postId);

  return (
    <main className={styles["community-container"]}>
      <RegionSelector />
      <div>{/* 카드형 게시글 */}</div>
      <div>{/* 카테고리 네비게이션 */}</div>
      <div>{/* 검색창 */}</div>
      <div>
        <PostDetail detail={detail} />
      </div>
      <aside>{/* 인기글 리스트 */}</aside>
    </main>
  );
}
