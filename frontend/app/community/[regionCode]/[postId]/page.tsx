// app/community/[regionCode]/[postId]/page.tsx

import { fetchPostDetail } from "@/libs/api/community/community.api";
import { Metadata, ResolvingMetadata } from "next";
import styles from "../../Community.module.css";
import RegionSelector from "../../components/RegionSelector";
import { DetailProps } from "../../types";
import PostDetail from "./PostDetail";
import BoardNavigation from "../components/BoardHeader";

interface PageProps {
  params: Promise<{
    regionCode: string;
    postId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ✅ SEO 메타데이터
export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
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
export default async function CommunityPage({ params }: PageProps) {
  const { regionCode, postId } = await params;
  const detail: DetailProps = await fetchPostDetail(postId);

  return (
    <main className={styles["community-container"]}>
      <RegionSelector />
      <div>{/* 카드형 게시글 */}</div>
      <div>
        <BoardNavigation />
      </div>
      <div>{/* 검색창 */}</div>
      <div>
        <PostDetail detail={detail} />
      </div>
      <aside>{/* 인기글 리스트 */}</aside>
    </main>
  );
}
