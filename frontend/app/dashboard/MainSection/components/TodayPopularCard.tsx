// app/dashboard/MainSection/components/TodayPopularCard.tsx
"use client";
import type { PostListDto as _PostListDto } from "@/app/community/types";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../MainSection.module.css";
import { usePopularPostsQuery } from "./usePopularPostsQuery";

// 타입 확장 (썸네일 대응)
type PostListDto = _PostListDto & { thumbnailUrl?: string };

const rankEmoji = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const FALLBACK = "/default-profile.webp";

export default function TodayPopularCard() {
  const { data, isLoading, isError } = usePopularPostsQuery();
  // ✅ posts를 useMemo로!
  const posts: PostListDto[] = useMemo(() => data?.posts ?? [], [data]);

  // UI 상태
  const [open, setOpen] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLLIElement>(null);

  // --- 외부 클릭 시 드롭다운 해제 (고정이 아닐 때만)
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

  // --- ESC로 닫기
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

  // --- 키보드 내비
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
          window.location.href = `/community/post/${posts[activeIdx].id}`;
        }
      }
    },
    [open, posts, activeIdx]
  );

  // --- hover: 고정이 아니면 바로 열리고, 마우스가 떠나면 120ms 후 닫힘
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

  // --- 로딩/에러 처리
  if (isLoading)
    return (
      <section className={styles.subCard}>
        <div className={styles.todayPopularRow}>
          <span className={styles.todayPopularTitle}>오늘의 인기</span>
          <span className={styles.heartIconSub}>💛</span>
        </div>
        <div className={styles.todayPopularSingle}>
          <div className={styles.skeletonBtn} style={{ height: 38 }} />
        </div>
      </section>
    );
  if (isError || !posts.length)
    return (
      <section className={styles.subCard}>
        <div className={styles.todayPopularRow}>
          <span className={styles.todayPopularTitle}>오늘의 인기</span>
          <span className={styles.heartIconSub}>💛</span>
        </div>
        <div className={styles.todayPopularSingleError}>오늘의 인기글을 불러올 수 없습니다</div>
      </section>
    );

  // --- 핵심: 래퍼(div) 전체가 hover/클릭 인식, 내부 row는 내용만!
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
        aria-controls="today-popular-listbox"
        role="button"
        onClick={handleClick}
        title="오늘의 인기글 더보기"
      >
        <div className={styles.todayPopularRow} tabIndex={-1}>
          <span className={styles.todayPopularTitle}>오늘의 인기</span>
          <span className={styles.heartIconSub} aria-hidden>💛</span>
        </div>
        {open && (
          <ul
            id="today-popular-listbox"
            className={styles.todayPopularDropdown}
            role="listbox"
            aria-label="오늘의 인기글 목록"
            tabIndex={-1}
            style={{
              left: 0,
              top: "calc(100% + 9px)",
              minWidth: 245,
              maxWidth: 340,
              position: "absolute",
            }}
            onKeyDown={handleKeyDown}
            aria-live="polite"
          >
            {posts.slice(0, 10).map((post, idx) => {
              const thumb = post.thumbnailUrl || FALLBACK;
              return (
                <li
                  ref={idx === 0 ? firstItemRef : undefined}
                  key={post.id || idx}
                  className={`${styles.top10ListItem} ${idx === activeIdx ? styles.top10ListItemActive : ""}`}
                  role="option"
                  aria-selected={idx === activeIdx}
                  tabIndex={0}
                  aria-label={`[${rankEmoji[idx]}] ${post.title}${post.title?.length > 32 ? " (더보기)" : ""}`}
                  onFocus={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(-1)}
                  onClick={() => window.location.href = `/community/post/${post.id}`}
                  title={post.title?.length > 32 ? post.title : undefined}
                >
                  <span className={styles.thumbWrap}>
                    <Image
                      src={thumb}
                      alt={post.title || "썸네일"}
                      width={38}
                      height={38}
                      style={{
                        objectFit: "cover",
                        width: 38,
                        height: 38,
                        borderRadius: 9,
                        background: "#f5eedc",
                        filter: idx === activeIdx ? "brightness(1.08)" : "brightness(0.95)",
                        transition: "filter .13s",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== FALLBACK) target.src = FALLBACK;
                      }}
                    />
                  </span>
                  <span className={styles.top10ListRank}>{rankEmoji[idx]}</span>
                  <span className={styles.top10ListTitle}>
                    {post.title?.length > 32 ? post.title.slice(0, 32) + "..." : post.title}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
