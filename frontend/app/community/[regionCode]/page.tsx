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

async function getBoardData(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1");

  const featuredPosts: PopularPost[] = [
    {
      id: 1,
      title: "이건 하드 코딩입니다. 그냥 더미임",
      description: "일단 이거 이미지 위에 겹쳐있어야해",
      thumbnail: "/images/post1.jpg",
    },
    {
      id: 2,
      title: "눌러도 의미 1도 없음",
      description: "103번은 왜 없을까? 삭제 여부로 표시해야하나?",
      thumbnail: "/images/post2.jpg",
    },
    {
      id: 3,
      title: "하 진짜 이건 모르겠다 ㅋㅋㅋ",
      description: "페이지네이션 땜에 그런 것 같은데 나중에 고치자",
      thumbnail: "/images/post3.jpg",
    },
    {
      id: 4,
      title: "아니 근데 진짜 지역코드를 왜 난 바보처럼 구현했을까",
      description: "폰트 깨짐 ㅋㅋ 미친 돈벌레 지나감",
      thumbnail: "/images/post4.jpg",
    },
  ];

  return {
    currentPage: page,
    featuredPosts,
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
  const data = await getBoardData(searchData);

  return (
    <div className={styles.container}>
      <RegionSelector />
      <PopularPostCards posts={data.featuredPosts} />
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
