import Link from "next/link";
import React from "react";
import styles from "../Community.module.css";
import { PostListDto } from "../types";

interface PostListDtoProps {
  posts: PostListDto[];
}

const PopularPostTable: React.FC<PostListDtoProps> = ({ posts }) => {
  return (
    <table className={styles["posts-table"]}>
      <thead>
        <tr>
          <th colSpan={3}>최신 인기글</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>
              <Link href={`/community/${String(post.regionId)}`}>
                <span className={styles.regionTag}>{post.regionName}</span>
              </Link>
            </td>

            <td>
              <Link
                href={`/community/${String(post.regionId)}/${post.id}`}
                className={styles["full-cell-link"]}
              >
                {post.title}
              </Link>
            </td>

            <td>
              <Link
                href={`/community/${String(post.regionId)}/${post.id}`}
                className={styles["full-cell-link"]}
              >
                👍{post.likes} 👁️{post.views}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PopularPostTable;
