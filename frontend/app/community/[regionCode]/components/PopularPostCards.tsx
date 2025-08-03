"use client";

import { getPostsByRegionPopular } from "@/libs/api/community/community.api";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PostListDto } from "../../types";
import styles from "./BoardList.module.css";

const PopularPostCards: React.FC = () => {
  const { regionCode } = useParams<{ regionCode: string }>();
  const [posts, setPosts] = useState<PostListDto[]>([]);

  useEffect(() => {
    if (!regionCode) return;

    const fetchPopularPosts = async () => {
      try {
        const data = await getPostsByRegionPopular(regionCode, 1, 4);
        setPosts(data.posts);
      } catch (err) {
        console.error("인기글 데이터를 불러오는데 실패했습니다:", err);
      }
    };

    fetchPopularPosts();
  }, [regionCode]);

  return (
    <section className={styles.cardsContainer} aria-label="인기 게시글">
      <div className={styles.cardsGrid}>
        {posts.map((post) => (
          <Link
            href={`/community/${regionCode}/${post.id}`}
            key={post.id}
            className={styles.cardLink}
          >
            <article className={styles.card}>
              <div className={styles.cardBackground}>
                {post.thumbnailUrl && (
                  <Image
                    src={post.thumbnailUrl}
                    alt={`${post.title} 썸네일`}
                    fill
                    sizes="(max-width: 290px) 290px, 200px"
                    priority
                  />
                )}
                <div className={styles.overlay} />
              </div>
              <div className={styles.overlayContent}>
                <h3 className={styles.overlayTitle}>{post.title}</h3>
                <p className={styles.overlayDescription}>{post.summary}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularPostCards;
