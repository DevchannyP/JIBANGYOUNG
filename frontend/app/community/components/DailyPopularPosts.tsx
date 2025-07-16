//주간 인기 게시글
import Link from "next/link";
import React from "react";
import styles from "../Community.module.css";

interface PopularPost {
  id: number;
  title: string;
  author: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  category: string;
  region?: string;
}

// 서버에서 데이터를 가져오는 함수
async function getDaliyPopularPosts(): Promise<PopularPost[]> {
  // 실제 환경에서는 API 호출 또는 데이터베이스 쿼리
  // await fetch('/api/weekly-popular-posts')

  // 현재는 mock 데이터 반환
  return [
    {
      id: 11,
      title: "인천혜택요. 한가를 받나다-",
      author: "인천청년",
      viewCount: 3847,
      likeCount: 256,
      commentCount: 63,
      createdAt: "2024-07-15T09:30:00Z",
      category: "정책후기",
      region: "인천",
    },
    {
      id: 12,
      title: "인천혜택요. 한가를 받나다-",
      author: "인천거주자",
      viewCount: 2923,
      likeCount: 189,
      commentCount: 52,
      createdAt: "2024-07-15T14:20:00Z",
      category: "정책정보",
      region: "인천",
    },
    {
      id: 13,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천청년",
      viewCount: 2654,
      likeCount: 172,
      commentCount: 48,
      createdAt: "2024-07-15T11:45:00Z",
      category: "생활정보",
      region: "인천",
    },
    {
      id: 14,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천살이",
      viewCount: 2432,
      likeCount: 163,
      commentCount: 41,
      createdAt: "2024-07-15T16:10:00Z",
      category: "정책정보",
      region: "인천",
    },
    {
      id: 15,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천드림",
      viewCount: 2298,
      likeCount: 154,
      commentCount: 37,
      createdAt: "2024-07-15T13:25:00Z",
      category: "정책정보",
      region: "인천",
    },
    {
      id: 16,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천청년",
      viewCount: 2156,
      likeCount: 145,
      commentCount: 33,
      createdAt: "2024-07-15T10:15:00Z",
      category: "생활정보",
      region: "인천",
    },
    {
      id: 17,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천이주자",
      viewCount: 2089,
      likeCount: 137,
      commentCount: 29,
      createdAt: "2024-07-15T15:30:00Z",
      category: "정책정보",
      region: "인천",
    },
    {
      id: 18,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천러버",
      viewCount: 1987,
      likeCount: 128,
      commentCount: 25,
      createdAt: "2024-07-15T12:40:00Z",
      category: "정책정보",
      region: "인천",
    },
    {
      id: 19,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천바다",
      viewCount: 1876,
      likeCount: 122,
      commentCount: 23,
      createdAt: "2024-07-15T17:20:00Z",
      category: "정책정보",
      region: "인천",
    },
    {
      id: 20,
      title: "인천혜택요. 기존과 받나다-",
      author: "인천청년",
      viewCount: 1765,
      likeCount: 119,
      commentCount: 21,
      createdAt: "2024-07-15T08:50:00Z",
      category: "정책정보",
      region: "인천",
    },
  ];
}

const DailyPopularPosts: React.FC = async () => {
  const posts = await getDaliyPopularPosts();

  return (
    <div className={styles["popular-card"]}>
      <div className={styles["popular-card-header"]}>
        <h3>오늘의 인기</h3>
        <span className={styles["icon"]}>👍</span>
      </div>

      <ul className={styles["popular-list"]}>
        {posts.map((post, idx) => (
          <li key={post.id}>
            <div className={styles["rank"]}>{idx + 1}</div>
            <div className={styles["title"]}>
              <Link href={`/community/posts/${post.id}`}>{post.title}</Link>
            </div>
            <div className={styles["like-count"]}>
              <span>👍 {post.likeCount}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyPopularPosts;
