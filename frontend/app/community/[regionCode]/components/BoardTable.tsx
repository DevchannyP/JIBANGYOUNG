// components/BoardTable.tsx (서버/클라이언트 호환)
import { formatBoardDate } from "@/libs/utils/date";
import Link from "next/link";
import React from "react";
import { PostListDto } from "../../types";
import styles from "./BoardList.module.css";

interface BoardTableProps {
  posts: PostListDto[];
}

const BoardTable: React.FC<BoardTableProps> = ({ posts }) => {
  const categoryMap: { [key: string]: string } = {
    FREE: "자유",
    QUESTION: "질문",
    INFO: "정보",
    SETTLEMENT_REVIEW: "후기",
    NOTICE: "공지",
  };

  // 더미 데이터 추가
  const dummyNotices: PostListDto[] = [
    {
      id: 9999,
      title: "[필독] 지방청년 커뮤니티 이용 규칙 안내",
      category: "NOTICE",
      createdAt: new Date().toISOString(),
      views: 1024,
      likes: 50,
      regionId: 1,
      regionName: "",
      userId: 0, // 추가
      thumbnailUrl: "", // 추가
      summary: "", // 추가
    },
    {
      id: 9998,
      title: "8월 커뮤니티 이벤트 당첨자 발표",
      category: "NOTICE",
      createdAt: new Date().toISOString(),
      views: 512,
      likes: 25,
      regionId: 1,
      regionName: "",
      userId: 0, // 추가
      thumbnailUrl: "", // 추가
      summary: "", // 추가
    },
  ];

  const displayPosts = [...dummyNotices, ...posts];

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
          {displayPosts.map((post, index) => {
            const postLink = `/community/${post.regionId}/${post.id}`;
            const isNotice = post.category === "NOTICE";
            const rowClassName =
              index < 2 && isNotice
                ? `${styles.tableRow} ${styles.noticeRow}`
                : styles.tableRow;
            const titleClassName = isNotice
              ? `${styles.titleLink} ${styles.noticeTitle}`
              : styles.titleLink;

            return (
              <tr key={post.id} className={rowClassName}>
                <td className={styles.authorCell}>
                  <span className={styles.categoryBadge}>
                    {categoryMap[post.category] || post.category}
                  </span>
                </td>
                <td className={styles.titleCell}>
                  <Link href={postLink} className={titleClassName}>
                    {post.title}
                  </Link>
                </td>
                <td className={styles.dateCell}>
                  {formatBoardDate(post.createdAt)}
                </td>
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
