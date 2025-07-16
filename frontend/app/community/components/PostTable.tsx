//최신 인기글
import React from "react";
import styles from "../Community.module.css";

export interface Post {
  id: number;
  region: string;
  title: string;
  author: string;
  date: string;
  likes: number;
  views: number;
}
interface PostsTableProps {
  posts: Post[];
}

const PostsTable: React.FC<PostsTableProps> = ({ posts }) => {
  return (
    <table className={styles["posts-table"]}>
      <thead>
        <tr>
          <th colSpan={5}>최신 인기글</th>
          {/* <th>작성자</th>
          <th>작성일</th>
          <th>조회</th>
          <th>추천</th> */}
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td align="left">
              <span className={styles.regionTag}>{post.region}</span>
              {post.title}
            </td>
            {/* <td>{post.author}</td>
            <td>{post.date}</td>
            <td>{post.views}</td> */}
            <td>👍{post.likes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PostsTable;
