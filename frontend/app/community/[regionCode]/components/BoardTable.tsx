// components/BoardTable.tsx
"use client";

import { fetchNoticesByRegion } from "@/libs/api/community/community.api";
import { formatBoardDate } from "@/libs/utils/date";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PostListDto } from "../../types";
import styles from "./BoardList.module.css";

interface BoardTableProps {
  posts: PostListDto[];
  regionCode: string;
}

const BoardTable: React.FC<BoardTableProps> = ({ posts, regionCode }) => {
  const [notices, setNotices] = useState<PostListDto[]>([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);

  const categoryMap: { [key: string]: string } = {
    FREE: "자유",
    QUESTION: "질문",
    INFO: "정보",
    REVIEW: "후기",
    NOTICE: "공지",
  };

  // 지역별 공지사항 로드
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoadingNotices(true);
        const regionNotices = await fetchNoticesByRegion(regionCode);
        setNotices(regionNotices);
      } catch (err) {
        console.error("공지사항 로드 실패:", err);
        setNotices([]);
      } finally {
        setIsLoadingNotices(false);
      }
    };

    loadNotices();
  }, [regionCode]);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.categoryColumn}>카테고리</th>
            <th className={styles.titleColumn}>제목</th>
            <th className={styles.authorColumn}>작성자</th>
            <th className={styles.dateColumn}>작성일</th>
            <th className={styles.viewsColumn}>조회</th>
            <th className={styles.commentsColumn}>추천</th>
          </tr>
        </thead>
        <tbody>
          {/* 공지사항*/}
          {notices.map((post) => (
            <tr
              key={`notice-${post.id}`}
              className={`${styles.tableRow} ${styles.noticeRow}`}
              style={{ backgroundColor: "#c4c4c475" }}
            >
              <td className={styles.categoryCell}>
                <span className={styles.categoryBadge}>공지</span>
              </td>
              <td className={styles.titleCell}>
                <Link
                  href={`/community/${post.regionId}/${post.id}`}
                  className={`${styles.titleLink} ${styles.noticeTitle}`}
                >
                  {post.title}
                </Link>
              </td>
              <td className={styles.authorCell}>
                {post.nickname || "알 수 없음"}
              </td>
              <td className={styles.dateCell}>
                {formatBoardDate(post.createdAt)}
              </td>
              <td className={styles.viewsCell}>{post.views}</td>
              <td className={styles.commentsCell}>{post.likes}</td>
            </tr>
          ))}

          {/* 일반 게시글 */}
          {posts.map((post) => (
            <tr key={`post-${post.id}`} className={styles.tableRow}>
              <td className={styles.categoryCell}>
                <span className={styles.categoryBadge}>
                  {categoryMap[post.category] || post.category}
                </span>
              </td>
              <td className={styles.titleCell}>
                <Link
                  href={`/community/${post.regionId}/${post.id}`}
                  className={styles.titleLink}
                >
                  {post.title}
                </Link>
              </td>
              <td className={styles.authorCell}>
                {post.nickname || "알 수 없음"}
              </td>
              <td className={styles.dateCell}>
                {formatBoardDate(post.createdAt)}
              </td>
              <td className={styles.viewsCell}>{post.views}</td>
              <td className={styles.commentsCell}>{post.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardTable;
