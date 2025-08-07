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
        console.error('공지사항 로드 실패:', err);
        setNotices([]);
      } finally {
        setIsLoadingNotices(false);
      }
    };

    loadNotices();
  }, [regionCode]);

  // 공지사항을 상단에, 일반 게시글을 하단에 배치
  const displayPosts = [...notices, ...posts];
  
  // 공지사항이 항상 상단에 오도록 정렬
  displayPosts.sort((a, b) => {
    if (a.isNotice && !b.isNotice) return -1; // a가 공지사항이면 위로
    if (!a.isNotice && b.isNotice) return 1;  // b가 공지사항이면 아래로
    return 0; // 둘 다 같은 타입이면 순서 유지
  });

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
            // isNotice 필드를 직접 사용하거나 공지사항 배열에서 온 것인지 확인
            const isNotice = post.isNotice || index < notices.length;
            const rowClassName = isNotice
              ? `${styles.tableRow} ${styles.noticeRow}`
              : styles.tableRow;
            const titleClassName = isNotice
              ? `${styles.titleLink} ${styles.noticeTitle}`
              : styles.titleLink;

            return (
              <tr 
                key={post.id} 
                className={rowClassName}
                style={isNotice ? { backgroundColor: '#fafafa' } : {}}
              >
                <td className={styles.authorCell}>
                  <span className={styles.categoryBadge}>
                    {isNotice ? "공지" : (categoryMap[post.category] || post.category)}
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