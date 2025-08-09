// app/dashboard/MainSection/components/ReviewCard.tsx
"use client";
import { useReviewTop3Query } from "@/libs/api/dashboard/reviewTop.api";
import { ReviewPostWithRank } from "@/types/dashboard/ReviewPostDto";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../ReviewCard.module.css";

const FALLBACK = "/default-profile.webp";
const rankEmoji = ["🥇", "🥈", "🥉"];

export default function ReviewCard() {
  const { data, isLoading, isError } = useReviewTop3Query();
  const posts: ReviewPostWithRank[] = useMemo(() => (data && data.length ? data.slice(0, 3) : []), [data]);

  // UI 상태
  const [open, setOpen] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫힘
  useEffect(() => {
    if (!open || fixed) return;
    const close = (e: Event) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("touchstart", close, { passive: true });
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("touchstart", close);
      window.removeEventListener("scroll", close);
    };
  }, [open, fixed]);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setFixed(false);
        setActiveIdx(-1);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  // 오픈 시 첫 아이템 포커스
  useEffect(() => {
    if (open && firstItemRef.current) {
      firstItemRef.current.focus();
    }
  }, [open]);

  // 키보드 내비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || !posts.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx(i => (i + 1 < posts.length ? i + 1 : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx(i => (i - 1 >= 0 ? i - 1 : posts.length - 1));
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (activeIdx !== -1 && posts[activeIdx]) {
          window.location.href = `/community/${posts[activeIdx].regionId}/${posts[activeIdx].id}`;
        }
      }
    },
    [open, posts, activeIdx]
  );

  // hover: 고정이 아니면 바로 열리고, 마우스가 떠나면 닫힘
  const handleHover = (enter: boolean) => {
    if (fixed) return;
    if (enter) {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
      setOpen(true);
    } else {
      closeTimeout.current = setTimeout(() => {
        setOpen(false);
        setActiveIdx(-1);
      }, 150);
    }
  };

  // 터치: 고정상태 아니면 열림
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!open && !fixed) setOpen(true);
  };

  // 버튼 클릭: 고정 상태 토글
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!open) {
      setOpen(true);
      setFixed(true);
    } else if (fixed) {
      setOpen(false);
      setFixed(false);
      setActiveIdx(-1);
    } else {
      setFixed(true);
    }
  };

  // 아이템 클릭 핸들러
  const handleItemClick = (e: React.MouseEvent, post: ReviewPostWithRank) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/community/${post.regionId}/${post.id}`;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.reviewCard}>
        <div className={styles.reviewHeader}>
          <span className={styles.reviewTitle}>인기 정착 후기</span>
          <span className={styles.reviewHeart} aria-hidden>💛</span>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          후기를 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !posts.length) {
    return (
      <div className={styles.reviewCard}>
        <div className={styles.reviewHeader}>
          <span className={styles.reviewTitle}>인기 정착 후기</span>
          <span className={styles.reviewHeart} aria-hidden>💛</span>
        </div>
        <div className={styles.errorState}>
          인기 후기를 불러올 수 없습니다
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={styles.reviewCard}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onTouchStart={handleTouchStart}
      tabIndex={0}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls="review-popular-listbox"
      role="button"
      onClick={handleClick}
      title="인기 정착 후기 더보기"
    >
      {/* 헤더 */}
      <div className={styles.reviewHeader}>
        <span className={styles.reviewTitle}>인기 정착 후기</span>
        <span className={styles.reviewHeart} aria-hidden>💛</span>
      </div>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          id="review-popular-listbox"
          className={styles.reviewDropdown}
          role="listbox"
          aria-label="인기 후기 목록"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          aria-live="polite"
        >
          <div className={styles.reviewGrid}>
            {posts.map((post, idx) => {
              const isActive = idx === activeIdx;
              const truncatedTitle = post.title?.length > 30 ? 
                post.title.slice(0, 30) + "..." : 
                post.title;

              return (
                <div
                  ref={idx === 0 ? firstItemRef : undefined}
                  key={post.id || `post-${idx}`}
                  className={`${styles.reviewItem} ${isActive ? styles.active : ''}`}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={0}
                  aria-label={`${idx + 1}위. ${post.title}`}
                  onFocus={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(-1)}
                  onClick={(e) => handleItemClick(e, post)}
                  title={post.title?.length > 24 ? post.title : undefined}
                >
                  {/* 썸네일과 랭킹 배지 */}
                  <div className={styles.thumbnailWrapper}>
                    <Image
                      src={post.thumbnailUrl || FALLBACK}
                      alt={post.title || "썸네일"}
                      width={110}
                      height={110}
                      className={styles.thumbnailImage}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== FALLBACK) target.src = FALLBACK;
                      }}
                    />
                    {/* 랭킹 배지 */}
                    <span className={styles.rankBadge}>
                      {rankEmoji[idx]}
                    </span>
                  </div>

                  {/* 콘텐츠 영역 */}
                  <div className={styles.itemContent}>
                    {/* 제목 */}
                    <span className={styles.itemTitle}>
                      {truncatedTitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}