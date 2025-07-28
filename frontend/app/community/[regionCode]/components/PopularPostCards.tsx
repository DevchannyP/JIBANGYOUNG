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
    <section className={styles.container} aria-label="인기 게시글">
      <div className={styles.cardsGrid}>
        {posts.map((post) => (
          <article key={post.id} className={styles.card}>
            <div className={styles.thumbnail}>
              <Image
                src={post.thumbnail}
                alt={`${post.title} 썸네일`}
                width={200}
                height={120}
                className={styles.thumbnailImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className={styles.thumbnailFallback} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>
                <Link href={`/board/${post.id}`}>{post.title}</Link>
              </h3>
              <p className={styles.description}>{post.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PopularPostCards;
