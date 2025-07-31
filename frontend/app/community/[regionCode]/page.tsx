// app/community/[regionCode]/page.tsx

import { fetchPostsByRegion } from "@/libs/api/community/community.api";
import { Metadata } from "next";
import PaginationClient from "../components/PaginationClient";
import RegionSelector from "../components/RegionSelector";
import BoardNavigation from "./components/BoardHeader";
import styles from "./components/BoardList.module.css";
import BoardTable from "./components/BoardTable";
import PopularPostCards from "./components/PopularPostCards";
import PopularPosts from "./components/PopularPosts";

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
  searchType?: string;
}

interface Props {
  params: Promise<{ regionCode: string }>;
  searchParams: Promise<SearchParams>;
}

interface PopularPost {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { regionCode } = await params;

  return {
    title: `${regionCode} 지역 게시판 - 협업 질문 및 모임 2025`,
    description: `${regionCode} 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판입니다.`,
    keywords: `${regionCode}, 지역게시판, 커뮤니티, 협업, 모임, 질문답변`,
    openGraph: {
      title: `${regionCode} 지역 게시판 - 협업 질문 및 모임 2025`,
      description: `${regionCode} 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BoardPage({ params, searchParams }: Props) {
  const pageParam = (await searchParams).page ?? "1";
  const currentPage = parseInt(pageParam, 10);

  console.log(currentPage);
  const { regionCode } = await params;
  const { posts, totalPages } = await fetchPostsByRegion(
    regionCode,
    currentPage
  );
  const searchData = await searchParams;

  return (
    <div className={styles.container}>
      <RegionSelector />
      <PopularPostCards />
      <BoardNavigation />
      <main className={styles.main}>
        <div className={styles.content}>
          <BoardTable posts={posts} />
          <PaginationClient totalPages={totalPages} />
        </div>
        <aside className={styles.sidebar}>
          <PopularPosts posts={posts} />
        </aside>
      </main>
    </div>
  );
}
