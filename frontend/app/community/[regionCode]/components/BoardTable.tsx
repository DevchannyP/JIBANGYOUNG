// components/BoardTable.tsx (서버/클라이언트 호환)
import Link from "next/link";
import React from "react";
import { PostListDto } from "../../types";
import styles from "./BoardList.module.css";

interface BoardTableProps {
  posts: PostListDto[];
}

const BoardTable: React.FC<BoardTableProps> = ({ posts }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.authorColumn}>카테고리</th>
            <th className={styles.titleColumn}>제목</th>
            <th className={styles.dateColumn}>작성일</th>
            <th className={styles.viewsColumn}>조회</th>
            <th className={styles.commentsColumn}>추천</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const postLink = `/community/${post.regionId}/${post.id}`;

            return (
              <tr key={post.id} className={styles.tableRow}>
                <td className={styles.authorCell}>
                  <span className={styles.categoryBadge}>{post.category}</span>
                </td>
                <td className={styles.titleCell}>
                  <Link href={postLink} className={styles.titleLink}>
                    {post.title}
                  </Link>
                </td>
                <td className={styles.dateCell}>{post.createdAt}</td>
                <td className={styles.viewsCell}>{post.views}</td>
                <td className={styles.commentsCell}>{post.likes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BoardTable;
