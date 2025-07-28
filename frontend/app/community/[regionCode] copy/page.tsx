import { fetchCommunityPostsByRegion } from "@/libs/api/community/community.api";
import { getRegionsBoard } from "@/libs/api/region.api"; // getAllRegions 임포트
import { Region } from "@/types/api/region.d"; // Region 타입 임포트
import { Metadata } from "next";
import styles from "../Community.module.css";
import PaginationClient from "../components/PaginationClient";
import RegionSelector from "../components/RegionSelector";
import RegionPostTable from "./RegionPostTable";
import TabNavigation from "./TapNavigation";

interface PageProps {
  params: Promise<{
    regionCode: string;
  }>;
}

async function getRegionName(regionCode: string): Promise<string> {
  const regions: Region[] = await getRegionsBoard();
  const foundRegion = regions.find(
    (r) => r.regionCode.toString() === regionCode
  );
  return foundRegion
    ? `${foundRegion.sido} ${foundRegion.guGun}`.trim()
    : "알 수 없음";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { regionCode } = await params;
  const regionName = await getRegionName(regionCode);

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
  const regionName = await getRegionName(regionCode);

  const { posts, totalPages } = await fetchCommunityPostsByRegion(regionCode);
  return (
    <main className={styles["community-container"]}>
      <RegionSelector />
      <div>{/* 카드형 게시글 */}</div>
      <div>
        <TabNavigation />
      </div>
      <div>{/* 검색창 */}</div>
      <div>
        <RegionPostTable posts={posts} />
        <PaginationClient totalPages={totalPages} />
      </div>
      <aside>{/* 인기글 리스트 */}</aside>
    </main>
  );
}
