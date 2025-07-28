import { fetchCommunityPostsByRegion } from "@/libs/api/community/community.api";
import { Metadata } from "next";
import PaginationClient from "../components/PaginationClient";
import RegionSelector from "../components/RegionSelector";
import BoardNavigation from "./components/BoardHeader";
import styles from "./components/BoardList.module.css";
import BoardTable from "./components/BoardTable";
import PopularPostCards from "./components/PopularPostCards";
import PopularPosts from "./components/PopularPosts";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  category?: string;
}

interface PopularPost {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
  searchType?: string;
}

interface PageProps {
  params: { regionCode: string };
  searchParams: SearchParams;
}

export async function generateMetadata({
  params,
}: {
  params: { regionCode: string };
}): Promise<Metadata> {
  return {
    title: `${params.regionCode} 지역 게시판 - 협업 질문 및 모임 2025`,
    description: `${params.regionCode} 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판입니다.`,
    keywords: `${params.regionCode}, 지역게시판, 커뮤니티, 협업, 모임, 질문답변`,
    openGraph: {
      title: `${params.regionCode} 지역 게시판 - 협업 질문 및 모임 2025`,
      description: `${params.regionCode} 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판`,
      type: "website",
      url: `https://example.com/board/${params.regionCode}`,
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
      title: "이건 하드 코딩입니다. 진짜 나 이거 왜이리 오래걸려 썅",
      description: "나 오늘 뭐했니 진짜 이미지는 일단 올라갔는데",
      thumbnail: "/images/post1.jpg",
    },
    {
      id: 2,
      title: "도대체 왜 ",
      description: "3번 게시글은 뜨는데 103번은 왜 없을까??",
      thumbnail: "/images/post2.jpg",
    },
    {
      id: 3,
      title: "하 진짜 이건 모르겟다 ㅋㅋㅋ",
      description:
        "아마도 페이지네이션 땜에 그런 것 같은데 하 이거는 언제 고쳐... 몰라 쫌 자고 일어나서해...",
      thumbnail: "/images/post3.jpg",
    },
    {
      id: 4,
      title: "아니 근데 진짜 지역코드를 괜히 하드코딩해놔서...",
      description:
        "그냥 왠만한 연산은 백으로 넘겼어야했는데 진짜 미쳐 환장하겟네",
      thumbnail: "/images/post4.jpg",
    },
  ];

  return {
    totalPages: 10,
    currentPage: page,
    featuredPosts,
  };
}

export default async function BoardPage({ params, searchParams }: PageProps) {
  const data = await getBoardData(searchParams);
  const { regionCode } = await params;
  const { posts, totalPages } = await fetchCommunityPostsByRegion(regionCode);
  return (
    <div className={styles.container}>
      <RegionSelector /> {/* regionCode 전달 안 함 */}
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
