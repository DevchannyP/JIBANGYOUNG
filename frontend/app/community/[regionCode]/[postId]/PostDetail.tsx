"use client";

import { formatDetailDate } from "@/libs/utils/date";
import { useAuthStore } from "@/store/authStore";
import { useReportStore } from "@/store/reportStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DetailProps } from "../../types";
import styles from "../components/BoardList.module.css";
import RecommendationButtons from "./components/RecommendationButtons";

interface Props {
  detail: DetailProps;
}

export default function PostDetail({ detail }: Props) {
  const { user } = useAuthStore();
  const params = useParams();
  const regionCode = params.regionCode;
  const { openReportModal } = useReportStore();
  const isAuthor = user && user.username === detail.author;
  console.log("안녕하세요" + detail.author);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.postMeta}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className={styles.boardTitle}>{detail.title}</h2>
          <button
            onClick={() =>
              openReportModal("POST", detail.id, {
                title: detail.title,
                authorName: detail.author,
              })
            }
            style={{
              padding: "6px 12px",
              backgroundColor: "#f21616ff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            신고
          </button>
          {isAuthor && (
            <Link
              href={`/community/${regionCode}/${detail.id}/edit`}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ffc82c",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              수정
            </Link>
          )}
        </div>
        <div>
          <span>작성자: {detail.author}</span>
          <span>작성일: {formatDetailDate(detail.createdAt)}</span>
          <span>조회: {detail.views}</span>
          <span>추천: {detail.likes}</span>
        </div>
      </div>
      <div
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: detail.content }}
      />
      <RecommendationButtons postId={detail.id} />
    </div>
  );
}
