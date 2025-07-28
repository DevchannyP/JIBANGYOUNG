import Link from "next/link";
import React from "react";
import styles from "../Community.module.css";
import { PostListDto } from "../types";

interface PopularPostTableProps {
  posts: PostListDto[];
}

const RegionPostTable: React.FC<PopularPostTableProps> = ({ posts }) => {
  return (
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
              <td>{post.id}</td>
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
  );
};

export default RegionPostTable;
