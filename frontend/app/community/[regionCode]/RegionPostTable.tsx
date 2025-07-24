import React from "react";
import styles from "../Community.module.css";
import Link from "next/link";
import { PostListDto } from "../types";

interface PopularPostTableProps {
  posts: PostListDto[];
}

const RegionPostTable: React.FC<PopularPostTableProps> = ({ posts }) => {
  return (
    <table className={styles["posts-table"]}>
      <thead>
        <tr>
          <th>NO</th>
          <th>제목</th>
          <th>글쓴이</th>
          <th>작성일</th>
          <th>조회</th>
          <th>추천</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => {
          // const isNotice = post.isNotice; // 공지 구분 필드가 있다면
          const regionCode = String(post.regionId).slice(0, 2);
          const postLink = `/community/${regionCode}/${post.id}`;

          return (
            <tr key={post.id}>
              {/* NO or 공지 뱃지 */}
              <td>
                {post.id}
              </td>
              {/* 제목 영역 */}
              <td align="left">
                <Link href={postLink} className={styles["full-cell-link"]}>
                  {post.title}
                </Link>
              </td>

              {/* <td>{post.author}</td> */}
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
