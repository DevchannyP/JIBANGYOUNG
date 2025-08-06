"use client";

import { canNavigateToPost, getPostUrl } from "@/libs/api/dashboard/getPostUrl";
import { useReviewTop3Query } from "@/libs/api/dashboard/reviewTop.api";
import { ReviewPostWithRank } from "@/types/dashboard/ReviewPostDto";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "../MainSection.module.css";

const MAX_TITLE_LENGTH = 24;
const MAX_SUMMARY_LENGTH = 45;

export default function ReviewCard() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isSuccess } = useReviewTop3Query();
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // ✅ React Query 콜백 로직을 useEffect로 분리
  useEffect(() => {
    if (isSuccess && data) {
      console.log(`🎉 React Query 성공: ${data.length}개 데이터 로드됨`);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError && error) {
      console.error("🚫 React Query 실패:", error);
    }
  }, [isError, error]);

  // 데이터 변경 시 실패 상태 초기화
  useEffect(() => {
    console.log("🔄 데이터 변경 감지, 실패 상태 초기화");
    setFailedImages(new Set());
  }, [data]);

  // 이미지 로딩 실패 핸들러
  const handleImageError = useCallback((postId: number, imageUrl: string) => {
    console.warn(`❌ 썸네일 로딩 실패 - ID: ${postId}, URL: ${imageUrl}`);
    setFailedImages(prev => new Set([...prev, postId]));
  }, []);

  // 이미지 로딩 성공 핸들러
  const handleImageLoad = useCallback((postId: number) => {
    console.log(`✅ 썸네일 로딩 성공 - ID: ${postId}`);
  }, []);

  // 클릭 핸들러들
  const handlePostClick = useCallback((row: ReviewPostWithRank | null) => {
    if (!row || !canNavigateToPost(row)) return;
    const postUrl = getPostUrl(row);
    if (postUrl) {
      console.log(`🔗 게시글 이동: ID ${row.id} -> ${postUrl}`);
      router.push(postUrl);
    }
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: ReviewPostWithRank | null) => {
    if (!row || !canNavigateToPost(row)) return;
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      handlePostClick(row);
    }
  }, [handlePostClick]);

  // 텍스트 자르기 함수
  const truncateText = useCallback((text: string, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }, []);

  // 처리된 리뷰 리스트 (실패한 이미지 제외)
  const processedReviewList: (ReviewPostWithRank | null)[] = (() => {
    if (!data || data.length === 0) {
      console.log("📭 데이터가 없어서 빈 슬롯 3개 생성");
      return Array.from({ length: 3 }, () => null);
    }

    console.log(`🔍 데이터 처리 시작: 총 ${data.length}개`);

    // 이미지 로딩 실패하지 않은 항목만 필터링
    const validData = data.filter(item => {
      if (!item) return false;

      const notFailed = !failedImages.has(item.id);
      console.log(`📋 ID ${item.id}: 실패여부=${!notFailed}, 썸네일='${item.thumbnailUrl?.substring(0, 30)}...'`);

      return notFailed;
    });

    console.log(`✅ 유효한 데이터: ${validData.length}개`);

    // 처음 3개만 선택하고 순위 재할당
    const top3Data = validData.slice(0, 3);
    const dataWithRank: ReviewPostWithRank[] = top3Data.map((item, index) => ({
      ...item,
      no: String(index + 1), // 1, 2, 3
    }));

    console.log("🏆 최종 Top3 데이터:", dataWithRank.map(item => ({ 
      no: item.no, 
      id: item.id, 
      title: item.title 
    })));

    // 항상 3개 슬롯 보장
    const result = Array.from({ length: 3 }).map((_, i) => dataWithRank[i] || null);
    console.log(`📦 최종 결과: [${result.map((item, i) => item ? `${i+1}:ID${item.id}` : `${i+1}:null`).join(', ')}]`);

    return result;
  })();

  console.log("🎨 렌더링 상태:", { 
    isLoading, 
    isError, 
    dataLength: data?.length || 0, 
    failedImagesCount: failedImages.size,
    processedCount: processedReviewList.filter(Boolean).length
  });

  return (
    <section className={styles.reviewSectionUp}>
      <div className={styles.reviewHeaderRow}>
        <span className={styles.reviewSectionTitleUp}>인기 정착 후기</span>
        <span className={styles.reviewSectionHeart} aria-hidden>💛</span>
        
        {/* 개발환경에서 새로고침 버튼 */}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={() => {
              console.log("🔄 수동 새로고침 실행");
              refetch();
            }}
            style={{
              marginLeft: "10px",
              padding: "4px 8px",
              fontSize: "12px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            🔄 새로고침
          </button>
        )}
      </div>

      <div className={styles.reviewCardListColUp}>
        {/* 로딩 상태 */}
        {isLoading && (
          <>
            {console.log("⏳ 로딩 상태 렌더링")}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className={clsx(styles.reviewCardItemColUp, styles.reviewSkeleton)}>
                <div className={styles.reviewThumbSkeletonCol} />
                <div className={styles.reviewContentCol}>
                  <div className={styles.reviewTextSkeletonUp} style={{ width: "88%" }} />
                  <div className={styles.reviewTextSkeletonUp} style={{ width: "54%" }} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* 에러 상태 */}
        {isError && (
          <>
            {console.log("❌ 에러 상태 렌더링:", error)}
            <div className={clsx(styles.reviewCardItemColUp, styles.reviewError)} style={{ flex: "1 1 0" }}>
              <div style={{ textAlign: "center", color: "#f66", padding: "20px" }}>
                인기 후기를 불러올 수 없습니다.<br />
                <button 
                  onClick={() => refetch()}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    background: "#f66",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  다시 시도
                </button>
              </div>
              {process.env.NODE_ENV === "development" && (
                <pre style={{ fontSize: "11px", marginTop: "8px", color: "#f66", textAlign: "left" }}>
                  {error instanceof Error ? error.message : String(error)}
                </pre>
              )}
            </div>
          </>
        )}

        {/* 실제 데이터 렌더링 */}
        {!isLoading && !isError && (
          <>
            {console.log("🎯 데이터 렌더링 시작")}
            {processedReviewList.map((row, i) => {
              // 빈 슬롯인 경우
              if (!row) {
                console.log(`📝 빈 슬롯 ${i + 1} 렌더링`);
                return (
                  <div
                    key={`empty-review-${i}`}
                    className={clsx(styles.reviewCardItemColUp, styles.reviewEmptyCard)}
                    style={{
                      opacity: 0.5,
                      background: "linear-gradient(145deg, #FAFAFA, #F0F0F0)",
                      border: "1.5px dashed #D0D0D0",
                      minHeight: 80,
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      borderRadius: "12px",
                    }}
                  >
                    <div style={{ 
                      fontSize: "20px", 
                      marginRight: "12px",
                      width: "60px",
                      height: "45px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#E8E8E8",
                      borderRadius: "8px"
                    }}>
                      📝
                    </div>
                    <div style={{
                      color: "#999",
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "1.4",
                    }}>
                      {i === 0 ? "첫 번째 후기를 기다리고 있어요!" : `${i + 1}번째 후기를 기다리고 있어요!`}
                    </div>
                  </div>
                );
              }

              // 실제 데이터가 있는 경우
              console.log(`🎯 실제 데이터 ${row.no}위 (ID: ${row.id}) 렌더링`);
              const canClick = canNavigateToPost(row);

              return (
                <div
                  key={`review-${row.id}-${row.no}`}
                  tabIndex={canClick ? 0 : -1}
                  className={clsx(
                    styles.reviewCardItemColUp,
                    canClick && styles.reviewCardItemActiveUp
                  )}
                  role={canClick ? "button" : undefined}
                  aria-label={
                    canClick
                      ? `${row.no}위 ${row.title} (${row.regionName}, 클릭 시 상세보기)`
                      : `${row.no}위 ${row.title} (상세 이동 불가)`
                  }
                  title={row.title}
                  style={{
                    cursor: canClick ? "pointer" : "not-allowed",
                    opacity: canClick ? 1 : 0.45,
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handlePostClick(row)}
                  onKeyDown={(e) => handleKeyDown(e, row)}
                >
                  <div className={styles.reviewThumbWrapCol}>
                    <Image
                      className={styles.reviewCardThumbCol}
                      src={row.thumbnailUrl!}
                      alt={`${row.title} 썸네일`}
                      draggable={false}
                      width={60}
                      height={45}
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      onLoad={() => handleImageLoad(row.id)}
                      onError={() => handleImageError(row.id, row.thumbnailUrl!)}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                        background: "#F8F8F8",
                        boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
                        transition: "transform 0.17s ease",
                      }}
                    />
                    <span className={styles.reviewRankBadgeCol}>
                      {row.no}
                    </span>
                  </div>
                  
                  <div className={styles.reviewCardTextBoxCol}>
                    <div className={styles.reviewCardTitleCol} title={row.title}>
                      {truncateText(row.title, MAX_TITLE_LENGTH)}
                    </div>
                    <div className={styles.reviewCardSummaryCol} title={row.summary || row.content}>
                      {truncateText(row.summary || row.content || "내용 없음", MAX_SUMMARY_LENGTH)}
                    </div>
                    <div className={styles.reviewCardMetaCol}>
                      <span className={styles.metaRegion} title={row.regionName}>
                        {row.regionName}
                      </span>
                      <span className={styles.metaDot}>·</span>
                      <span className={styles.metaAuthor} title={row.author}>
                        {row.author || "작성자 미상"}
                      </span>
                      <span className={styles.metaDot}>·</span>
                      <span className={styles.metaLikes} title={`좋아요 ${row.likes}개`}>
                        👍 {row.likes}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}