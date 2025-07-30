import { fetchPostDetail } from "@/libs/api/community/community.api";
import { Metadata, ResolvingMetadata } from "next";
import styles from "../../Community.module.css";
import RegionSelector from "../../components/RegionSelector";
import { DetailProps } from "../../types";
import PostDetail from "./PostDetail";

interface PageProps {
  params: {
    regionCode: string;
    postId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// ✅ SEO 메타데이터
export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const awaitedParams = await params;         // 🔶 비동기 해제
  const { regionCode } = awaitedParams;

  return {
    title: `${regionCode} 커뮤니티 - 지방청년`,
    description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    openGraph: {
      title: `${regionCode} 커뮤니티 - 지방청년`,
      description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    },
  };
}

// ✅ 게시글 상세 페이지
export default async function CommunityPage({ params }: PageProps) {
  const awaitedParams = await params;         // 🔶 비동기 해제
  const { regionCode, postId } = awaitedParams;
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
