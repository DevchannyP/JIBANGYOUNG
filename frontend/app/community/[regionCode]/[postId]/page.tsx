// app/community/[regionCode]/[postId]/page.tsx
import {
  fetchPostDetail,
  fetchPostsByRegion,
} from "@/libs/api/community/community.api";
import { Metadata } from "next";
import styles from "../components/BoardList.module.css";
import RegionSelector from "../../components/RegionSelector";
import { DetailProps } from "../../types";
import BoardNavigation from "../components/BoardHeader";
import PopularPosts from "../components/PopularPosts";
import PostDetail from "./PostDetail";
import CommentSection from "./components/CommentSection";

interface Props {
  params: {
    regionCode: string;
    postId: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

// ✅ SEO 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { regionCode } = params;

  return {
    title: `${regionCode} 커뮤니티 - 지방청년`,
    description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    openGraph: {
      title: `${regionCode} 커뮤니티 - 지방청년`,
      description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    },
  };
}

export default async function CommunityPostPage({ params }: Props) {
  const { regionCode, postId } = params;
  
  // 데이터 페칭은 병렬로 처리하여 성능을 최적화합니다.
  const [detail, { posts }] = await Promise.all([
    fetchPostDetail(postId),
    fetchPostsByRegion(regionCode, 1)
  ]);

  return (
    <div className={styles.container}>
      <RegionSelector />
      <div>{/* 카드형 게시글 */}</div>
      <BoardNavigation />
      <div>{/* 검색창 */}</div>
      <div className={styles.main}>
        <div className={styles.content}>
          <PostDetail detail={detail} />
          <CommentSection postId={postId} />
        </div>
        <aside className={styles.sidebar}>
          <PopularPosts posts={posts} />
        </aside>
      </div>
    </div>
  );
}
