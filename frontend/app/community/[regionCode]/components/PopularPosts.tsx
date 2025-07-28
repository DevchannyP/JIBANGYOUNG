// components/PopularPosts.tsx
import React from "react";
import styles from "./BoardList.module.css";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
}

interface PopularPostsProps {
  posts: Post[];
}

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>서울 주간 인기글</h2>
        <button className={styles.shareButton} type="button">
          📤
        </button>
      </div>

      <ol className={styles.list}>
        {posts.map((post, index) => (
          <li key={post.id} className={styles.item}>
            <span className={styles.rank}>{index + 1}.</span>
            <a href={`/board/${post.id}`} className={styles.link}>
              {post.title}
            </a>
            <span className={styles.indicator}>●</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PopularPosts;
