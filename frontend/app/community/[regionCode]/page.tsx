// app/board/page.tsx (서버 컴포넌트)
import { Metadata } from "next";
import RegionSelector from "../components/RegionSelector";
import BoardContent from "./components/BoardContent";
import BoardNavigation from "./components/BoardHeader";
import styles from "./components/BoardList.module.css";
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "서울 지역 게시판 - 협업 질문 및 모임 2025",
    description:
      "서울 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판입니다. 지역 정보와 경험을 공유하세요.",
    keywords: "서울, 지역게시판, 커뮤니티, 협업, 모임, 질문답변",
    openGraph: {
      title: "서울 지역 게시판 - 협업 질문 및 모임 2025",
      description: "서울 지역 주민들의 협업, 질문, 모임을 위한 커뮤니티 게시판",
      type: "website",
      url: "https://example.com/board",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://example.com/board",
    },
  };
}

// 데이터 fetching 함수 (서버에서 실행)
async function getBoardData(searchParams: SearchParams) {
  // 실제로는 데이터베이스나 API에서 데이터를 가져와야 합니다
  const page = parseInt(searchParams.page || "1");

  const mockPosts: Post[] = [
    {
      id: 1,
      title: "공지사항 입니다.공지사항 입니다.공지사항 입니다.",
      author: "관리자",
      date: "2025-07-06",
      views: 15,
      comments: 26,
      category: "공지",
    },
    {
      id: 2,
      title: "금일 21시 부터 서버점검으로 인하여 홈페이지 이용제한..",
      author: "관리자",
      date: "2025-07-06",
      views: 15,
      comments: 26,
      category: "공지",
    },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 3,
      title: "부산 인기글입니다.",
      author: "남도일",
      date: "2025-07-06",
      views: 15,
      comments: 26,
    })),
  ];

  const popularPosts: Post[] = [
    {
      id: 1,
      title: "두번째 게시글 입니다...",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 2,
      title: "두번째 게시글 입니다...",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 3,
      title: "오늘 10대들 물놀이소 1위",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 4,
      title: "두번째 게시글 입니다...",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 5,
      title: "두번째 게시글 입니다...",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 6,
      title: "오늘 10대들 물놀이소 1위",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 7,
      title: "두번째 게시글 입니다...",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 8,
      title: "오늘 10대들 물놀이소 1위",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 9,
      title: "두번째 게시글 입니다...",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
    {
      id: 10,
      title: "두번째 게시글 입니다...",
      author: "",
      date: "",
      views: 0,
      comments: 0,
    },
  ];

  const featuredPosts: PopularPost[] = [
    {
      id: 1,
      title: "서울 지역 협업 질문 및 모임 2025...",
      description: "여러분과 함께하는 클라이딩 일상의 멋진하실까...",
      thumbnail: "/images/post1.jpg",
    },
    {
      id: 2,
      title: "서울 지역 협업 질문 및 모임 2025...",
      description: "여러분과 함께하는 클라이딩 일상의 멋진하실까...",
      thumbnail: "/images/post2.jpg",
    },
    {
      id: 3,
      title: "서울 지역 협업 질문 및 모임 2025...",
      description: "여러분과 함께하는 클라이딩 일상의 멋진하실까...",
      thumbnail: "/images/post3.jpg",
    },
    {
      id: 4,
      title: "서울 지역 협업 질문 및 모임 2025...",
      description: "여러분과 함께하는 클라이딩 일상의 멋진하실까...",
      thumbnail: "/images/post4.jpg",
    },
  ];

  return {
    posts: mockPosts,
    totalPages: 10,
    currentPage: page,
    popularPosts,
    featuredPosts,
  };
}

// 서버 컴포넌트 (메인 페이지)
export default async function BoardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const data = await getBoardData(searchParams);
  const { regionCode } = await params;
  return (
    <div className={styles.container}>
      <RegionSelector />
      {/* 서버에서 렌더링되는 인기글 카드 */}
      <PopularPostCards posts={data.featuredPosts} />

      {/* 클라이언트 컴포넌트 (인터랙션 필요) */}
      <BoardNavigation />

      <main className={styles.main}>
        <div className={styles.content}>
          {/* 클라이언트 컴포넌트 (검색, 페이지네이션 등 인터랙션) */}
          <BoardContent
            regionCode={regionCode}
            posts={data.posts}
            currentPage={data.currentPage}
            totalPages={data.totalPages}
          />
        </div>

        <aside className={styles.sidebar}>
          {/* 서버에서 렌더링되는 인기글 목록 */}
          <PopularPosts posts={data.popularPosts} />
        </aside>
      </main>
    </div>
  );
}
