"use client";

import { formatDetailDate } from "@/libs/utils/date";
import { useAuthStore } from "@/store/authStore";
import { useReportStore } from "@/store/reportStore";
import { deleteCommunityPost } from "@/libs/api/community/community.api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DetailProps } from "../../types";
import styles from "../components/BoardList.module.css";
import RecommendationButtons from "./components/RecommendationButtons";

interface Props {
  detail: DetailProps;
}

export default function PostDetail({ detail }: Props) {
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const regionCode = params.regionCode;
  const { openReportModal } = useReportStore();
  const isAuthor = user && user.username === detail.author;
  const [isDeleting, setIsDeleting] = useState(false);
  console.log("안녕하세요" + detail.author);

  const handleDeletePost = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCommunityPost(detail.id.toString());
      alert("게시글이 성공적으로 삭제되었습니다.");
      router.push(`/community/${regionCode}`);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert(error instanceof Error ? error.message : "게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

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
          <div style={{ display: "flex", gap: "8px" }}>
            {!isAuthor && (
              <button
                onClick={() =>
                  openReportModal("POST", detail.id, {
                    title: detail.title,
                    authorName: detail.author,
                  })
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc3545",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  padding: "0",
                  textDecoration: "underline",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#b02a37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#dc3545";
                }}
              >
                신고
              </button>
            )}
            {isAuthor && (
              <>
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
                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: isDeleting ? "#ccc" : "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = "#b02a37";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = "#dc3545";
                    }
                  }}
                >
                  {isDeleting ? "삭제중..." : "삭제"}
                </button>
              </>
            )}
          </div>
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
