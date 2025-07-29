"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./BoardList.module.css";

interface PopularPost {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

interface PopularPostCardsProps {
  posts: PopularPost[];
}

const PopularPostCards: React.FC<PopularPostCardsProps> = ({ posts }) => {
  return (
    <section className={styles.cardsContainer} aria-label="인기 게시글">
      <div className={styles.cardsGrid}>
        {posts.map((post) => (
          <Link
            href={`/board/${post.id}`}
            key={post.id}
            className={styles.cardLink}
          >
            <article className={styles.card}>
              <div className={styles.cardBackground}>
                {post.thumbnail && (
                  <Image
                    src="https://jibangyoung-s3.s3.ap-northeast-2.amazonaws.com/main/KakaoTalk_20250729_115106959_01.webp"
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
                <p className={styles.overlayDescription}>{post.description}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularPostCards;
