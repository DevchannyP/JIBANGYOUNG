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

interface Props {
  params: Promise<{
    regionCode: string;
    postId: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

// ✅ SEO 메타데이터 - Next.js 15 방식으로 수정
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { regionCode } = await props.params;

  return {
    title: `${regionCode} 커뮤니티 - 지방청년`,
    description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    openGraph: {
      title: `${regionCode} 커뮤니티 - 지방청년`,
      description: `${regionCode} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    },
  };
}

export default async function CommunityPage({ params }: Props) {
  const { regionCode, postId } = await params;
  const detail: DetailProps = await fetchPostDetail(postId);
  const { posts, totalPages } = await fetchPostsByRegion(regionCode, 1);
  return (
    <div className={styles.container}>
      <RegionSelector />
      <div>{/* 카드형 게시글 */}</div>
      <BoardNavigation />
      <div>{/* 검색창 */}</div>
      <div className={styles.main}>
        <div className={styles.content}>
          <PostDetail detail={detail} />
        </div>
        <aside className={styles.sidebar}>
          <PopularPosts posts={posts} />
        </aside>
      </div>
    </div>
  );
}
