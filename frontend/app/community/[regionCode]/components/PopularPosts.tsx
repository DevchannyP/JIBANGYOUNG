// components/PopularPosts.tsx
"use client";

import { fetchPopularPostsByRegion } from "@/libs/api/community/community.api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PostListDto } from "../../types";
import styles from "./BoardList.module.css";

interface Props {
  regionCode: string;
}

export default function PopularPosts({ regionCode }: Props) {
  const [posts, setPosts] = useState<PostListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 지역별 인기글 로드
  useEffect(() => {
    const loadPopularPosts = async () => {
      try {
        setIsLoading(true);
        const popularPosts = await fetchPopularPostsByRegion(regionCode);
        setPosts(popularPosts);
        setError(null);
      } catch (err) {
        console.error('인기글 로드 실패:', err);
        setError('인기글을 불러오는데 실패했습니다.');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularPosts();
  }, [regionCode]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles["popular-card"]}>
        <div className={styles["popular-card-header"]}>
          <h3>지역 인기순</h3>
          <span className={styles["icon"]}>👍</span>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles["popular-card"]}>
        <div className={styles["popular-card-header"]}>
          <h3>지역 인기순</h3>
          <span className={styles["icon"]}>👍</span>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles["popular-card"]}>
      <div className={styles["popular-card-header"]}>
        <h3>지역 인기순</h3>
        <span className={styles["icon"]}>👍</span>
      </div>

      <ul className={styles["popular-list"]}>
        {posts.length === 0 ? (
          <li style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            인기글이 없습니다.
          </li>
        ) : (
          posts.map((post, index) => (
            <li key={post.id}>
              <div className={styles["rank"]}>{index + 1}</div>
              <div className={styles["title"]}>
                <Link href={`/community/${post.regionId}/${post.id}`}>
                  {post.title}
                </Link>
              </div>
              <div className={styles["like-count"]}>
                <span>👍 {post.likes}</span> <span>👁️ {post.views}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}