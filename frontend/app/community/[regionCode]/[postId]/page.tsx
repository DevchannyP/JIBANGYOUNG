import { Metadata } from 'next';
import { DetailProps, region } from '../../types';
import RegionBoardNavigation from '../../components/RegionBoardNavigation';
import styles from "../../Community.module.css";
import { fetchPostDetail} from '@/libs/api/community/community.api';
import PostDetail from './PostDetail';


interface PageProps {
  params: {
    regionCode: string;
    postId: string;
  };
}

function getRegionName(regionCode: string): string {
  return region[regionCode] || "알 수 없음";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { regionCode, postId } = await params;
  const regionName = getRegionName(regionCode);
  
  return {
    title: `${regionName} 커뮤니티 - 지방영`,
    description: `${regionName} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    openGraph: {
      title: `${regionName} 커뮤니티 - 지방영`,
      description: `${regionName} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    },
  };
}

export default async function CommunityPage({ params }: PageProps) {
  const { regionCode, postId } = await params;
  const regionName = getRegionName(regionCode);

  const detail: DetailProps = await fetchPostDetail(postId);
  return (
      <main className={styles["community-container"]}>
          <RegionBoardNavigation />
      <div>
        {/* 카드형 게시글 */}
      </div>
      <div>
        {/* 카테고리 네비게이션 */}
      </div>
      <div>
        {/* 검색창 */}
      </div>
      <div>
        <PostDetail detail={detail} />
      </div>
      <aside>
        {/* 인기글 리스트 */}
      </aside>
    </main>
  );
}