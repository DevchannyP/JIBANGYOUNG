import { fetchPostDetail } from "@/libs/api/community/community.api";
import styles from "../../Community.module.css";
import RegionSelector from "../../components/RegionSelector";
import { DetailProps } from "../../types";
import PostDetail from "./PostDetail";

interface PageProps {
  params: {
    regionCode: string;
    postId: string;
  };
}

// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   const { regionCode } = params;
//   const regionName = await getRegionName(regionCode);

//   return {
//     title: `${regionName} 커뮤니티 - 지방청년`,
//     description: `${regionName} 지역 청년을 위한 커뮤니티 게시판입니다.`,
//     openGraph: {
//       title: `${regionName} 커뮤니티 - 지방청년`,
//       description: `${regionName} 지역 청년을 위한 커뮤니티 게시판입니다.`,
//     },
//   };
// }

export default async function CommunityPage({ params }: PageProps) {
  const { regionCode, postId } = params;

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
