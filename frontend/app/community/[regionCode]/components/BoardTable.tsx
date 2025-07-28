// components/BoardTable.tsx (서버/클라이언트 호환)
import Link from "next/link";
import React from "react";
import styles from "./BoardList.module.css";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  category?: string;
}

interface BoardTableProps {
  posts: Post[];
}

const BoardTable: React.FC<BoardTableProps> = ({ posts }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.noColumn}>NO</th>
            <th className={styles.titleColumn}>제목</th>
            <th className={styles.authorColumn}>글쓴이</th>
            <th className={styles.dateColumn}>작성일</th>
            <th className={styles.viewsColumn}>조회</th>
            <th className={styles.commentsColumn}>추천</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className={styles.row}>
              <td className={styles.noCell}>
                {post.category ? (
                  <span className={styles.categoryBadge}>{post.category}</span>
                ) : (
                  post.id
                )}
              </td>
              <td className={styles.titleCell}>
                <Link href={`/board/${post.id}`} className={styles.titleLink}>
                  {post.title}
                </Link>
              </td>
              <td className={styles.authorCell}>{post.author}</td>
              <td className={styles.dateCell}>{post.date}</td>
              <td className={styles.viewsCell}>{post.views}</td>
              <td className={styles.commentsCell}>{post.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardTable;
