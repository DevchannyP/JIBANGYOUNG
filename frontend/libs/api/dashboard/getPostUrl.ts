import { ReviewPostDto } from "@/types/dashboard/ReviewPostDto";

/**
 * 게시글 상세 페이지 URL 생성
 * @param row 리뷰 게시글 정보
 * @returns 게시글 상세 페이지 URL
 */
export function getPostUrl(row: ReviewPostDto): string | null {
  if (!row?.id) {
    console.warn("⚠️ getPostUrl: 유효하지 않은 게시글 ID:", row);
    return null;
  }
  
  return `/community/post/${row.id}`;
}

/**
 * 게시글 URL 유효성 검증
 * @param row 리뷰 게시글 정보
 * @returns URL 생성 가능 여부
 */
export function canNavigateToPost(row: ReviewPostDto): boolean {
  return !!(row?.id && row.id > 0);
}
