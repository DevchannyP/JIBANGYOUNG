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
      <table className={styles["posts-table"]}>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성일</th>
            <th>조회</th>
            <th>추천</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const postLink = `/community/${post.regionId}/${post.id}`;

            return (
              <tr key={post.id}>
                <td>{post.category}</td>
                <td align="left">
                  <Link href={postLink} className={styles["full-cell-link"]}>
                    {post.title}
                  </Link>
                </td>

                <td>{post.createdAt}</td>
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BoardTable;
