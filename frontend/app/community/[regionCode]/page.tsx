import { Metadata } from 'next';
import { region } from '../types';
import RegionBoardNavigation from '../components/RegionBoardNavigation';
import styles from "../Community.module.css";
import RegionPostTable from './RegionPostTable';
import { fetchCommunityPostsByRegion} from '@/libs/api/community/community.api';
import PaginationClient from '../components/PaginationClient';
import TabNavigation from './TapNavigation';

interface PageProps {
  params: {
    regionCode: string;
  };
}

function getRegionName(regionCode: string): string {
  return region[regionCode] || "알 수 없음";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { regionCode } = await params;
  const regionName = getRegionName(regionCode);
  
  return {
    title: `${regionName} 커뮤니티 - 지방청년`,
    description: `${regionName} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    openGraph: {
      title: `${regionName} 커뮤니티 - 지방청년`,
      description: `${regionName} 지역 청년을 위한 커뮤니티 게시판입니다.`,
    },
  };
}

export default async function CommunityPage({ params }: PageProps) {
  const { regionCode } = await params;
  const regionName = getRegionName(regionCode);
  
  const { posts, totalPages } = await fetchCommunityPostsByRegion(regionCode);
  return (
      <main className={styles["community-container"]}>
          <RegionBoardNavigation />
      <div>
        {/* 카드형 게시글 */}
      </div>
      <div>
        <TabNavigation />
      </div>
      <div>
        {/* 검색창 */}
      </div>
      <div>
        <RegionPostTable posts={posts}/>
        <PaginationClient totalPages={totalPages} />
      </div>
      <aside>
        {/* 인기글 리스트 */}
      </aside>
    </main>
  );
}