// app/community/[regionCode]/[postId]/page.tsx
import {
  fetchPostDetail,
  fetchPostsByRegion,
} from "@/libs/api/community/community.api";
import { getGuGunNameByCode } from "@/libs/utils/region";
import { Metadata } from "next";
import RegionSelector from "../../components/RegionSelector";
import BoardNavigation from "../components/BoardHeader";
import styles from "../components/BoardList.module.css";
import PopularPosts from "../components/PopularPosts";
import PostDetail from "./PostDetail";
import CommentSection from "./components/CommentSection";

interface Props {
  params: Promise<{
    regionCode: string;
    postId: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { regionCode } = await params;
    const guGunName = await getGuGunNameByCode(regionCode);

  return {
    title: `${guGunName} 지역 게시판 - 협업 질문 및 모임 2025`,
    description: `${guGunName} 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판입니다.`,
    keywords: `${guGunName}, 지역게시판, 커뮤니티, 협업, 모임, 질문답변`,
    openGraph: {
      title: `${guGunName} 지역 게시판 - 협업 질문 및 모임 2025`,
      description: `${guGunName} 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CommunityPostPage({ params }: Props) {
  const { regionCode, postId } = await params;

  // 데이터 페칭은 병렬로 처리하여 성능을 최적화합니다.
  const [detail, { posts }] = await Promise.all([
    fetchPostDetail(postId),
    fetchPostsByRegion(regionCode, 1),
  ]);

  return (
    <div className={styles.container}>
      <RegionSelector />
      <BoardNavigation />
      <div className={styles.main}>
        <div className={styles.content}>
          <PostDetail detail={detail} />
          <CommentSection postId={postId} />
        </div>
        <aside className={styles.sidebar}>
          <PopularPosts regionCode={regionCode}/>
        </aside>
      </div>
    </div>
  );
}
