// app/dashboard/MainSection/components/ReviewCard.tsx
"use client";
import { useReviewTop3Query } from "@/libs/api/dashboard/reviewTop.api";
import { ReviewPostWithRank } from "@/types/dashboard/ReviewPostDto";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../MainSection.module.css";

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
      }, 120);
    }
  };

  // 터치: 고정상태 아니면 열림
  const handleTouchStart = () => {
    if (!open && !fixed) setOpen(true);
  };

  // 버튼 클릭: 고정 상태 토글
  const handleClick = () => {
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

  // 로딩/에러 처리
  if (isLoading)
    return (
      <section className={styles.subCard}>
        <div className={styles.reviewHeaderRow}>
          <span className={styles.reviewSectionTitleUp}>인기 정착 후기</span>
          <span className={styles.reviewSectionHeart} aria-hidden>💛</span>
        </div>
        <div className={styles.todayPopularSingle}>
          <div className={styles.skeletonBtn} style={{ height: 38 }} />
        </div>
      </section>
    );
  if (isError || !posts.length)
    return (
      <section className={styles.subCard}>
        <div className={styles.reviewHeaderRow}>
          <span className={styles.reviewSectionTitleUp}>인기 정착 후기</span>
          <span className={styles.reviewSectionHeart} aria-hidden>💛</span>
        </div>
        <div className={styles.todayPopularSingleError}>인기 후기를 불러올 수 없습니다</div>
      </section>
    );

  // 본 카드: 래퍼 전체가 hover/클릭 인식!
  return (
    <section className={styles.subCard}>
      <div
        ref={wrapRef}
        className={styles.todayPopularWrap}
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
        style={{ outline: "none" }}
      >
        <div className={styles.reviewHeaderRow} tabIndex={-1}>
          <span className={styles.reviewSectionTitleUp}>인기 정착 후기</span>
          <span className={styles.reviewSectionHeart} aria-hidden>💛</span>
        </div>
        {open && (
          <div
            id="review-popular-listbox"
            className={styles.todayPopularDropdown}
            role="listbox"
            aria-label="인기 후기 목록"
            tabIndex={-1}
            style={{
              left: 0,
              top: "calc(100% + 9px)",
              minWidth: 270,
              maxWidth: 400,
              position: "absolute",
              zIndex: 30,
            }}
            onKeyDown={handleKeyDown}
            aria-live="polite"
          >
            {posts.map((post, idx) => (
              <div
                ref={idx === 0 ? firstItemRef : undefined}
                key={post.id || idx}
                className={`${styles.top10ListItem} ${idx === activeIdx ? styles.top10ListItemActive : ""}`}
                role="option"
                aria-selected={idx === activeIdx}
                tabIndex={0}
                aria-label={`[${rankEmoji[idx]}] ${post.title?.length > 32 ? post.title.slice(0, 32) + "..." : post.title}`}
                onFocus={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
                onClick={() => window.location.href = `/community/${post.regionId}/${post.id}`}
                title={post.title?.length > 32 ? post.title : undefined}
                style={{
                  display: "flex", alignItems: "center", cursor: "pointer",
                  padding: 12, borderRadius: 10, marginBottom: 2,
                  background: idx === activeIdx ? "#FFFCE4" : "#fff"
                }}
              >
                <span style={{ marginRight: 14 }}>
                  <Image
                    src={post.thumbnailUrl || FALLBACK}
                    alt={post.title || "썸네일"}
                    width={46}
                    height={46}
                    style={{
                      objectFit: "cover",
                      width: 46,
                      height: 46,
                      borderRadius: 9,
                      background: "#f5eedc",
                      filter: idx === activeIdx ? "brightness(1.09)" : "brightness(0.96)",
                      transition: "filter .13s",
                    }}
                    loading="lazy"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== FALLBACK) target.src = FALLBACK;
                    }}
                  />
                </span>
                <span style={{
                  fontSize: 22, marginRight: 13, width: 26, display: "inline-block", textAlign: "center"
                }}>
                  {rankEmoji[idx]}
                </span>
                <span style={{
                  fontSize: "15px", fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                  {post.title?.length > 32 ? post.title.slice(0, 32) + "..." : post.title}
                </span>
                <span style={{
                  color: "#aaa", fontSize: 12, fontWeight: 500, marginLeft: 14, minWidth: 48, textAlign: "right"
                }}>
                  {post.regionName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
