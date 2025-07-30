"use client";

import type { PostListDto } from "@/app/community/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "../MainSection.module.css";

const FALLBACK = "/default-profile.webp";

interface Props {
  posts: PostListDto[];
  isLoading: boolean;
  isError: boolean;
  error?: any;
  currIdx: number;
  setCurrIdx: (idx: number) => void;
}

export default function RightThumbCard({ posts, isLoading, isError, currIdx, setCurrIdx }: Props) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const thumbPosts = (posts ?? []).slice(0, 10);

  // 썸네일 자동 순환
  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new window.IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.1 }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

useEffect(() => {
  if (!inView || thumbPosts.length < 1) return;
  const timer = setInterval(() => {
    setCurrIdx((currIdx + 1) % thumbPosts.length);
  }, 3000);
  return () => clearInterval(timer);
}, [inView, thumbPosts.length, currIdx, setCurrIdx]);


  // Fade animation
  const [fade, setFade] = useState(true);
  useEffect(() => {
    setFade(false);
    const id = setTimeout(() => setFade(true), 140);
    return () => clearTimeout(id);
  }, [currIdx]);

  if (isLoading || !inView)
    return (
      <section className={styles.top10Box} ref={wrapRef} aria-busy="true">
        <div className={styles.thumbBoxLarge}>
          <div className={styles.thumbImageSkeletonLarge} />
          <div className={styles.thumbTitleSkeletonLarge} />
        </div>
      </section>
    );

  if (isError)
    return (
      <section className={styles.top10Box} ref={wrapRef}>
        <div className={styles.thumbBoxLarge}>
          <div className={styles.thumbTitle}>썸네일 로딩 실패 😥</div>
        </div>
      </section>
    );

  if (thumbPosts.length === 0)
    return (
      <section className={styles.top10Box} ref={wrapRef}>
        <div className={styles.thumbBoxLarge}>
          <div className={styles.thumbTitle}>썸네일 게시글이 없습니다</div>
        </div>
      </section>
    );

  const curr = thumbPosts[currIdx];
  const imgSrc = curr?.thumbnailUrl || FALLBACK;

  return (
    <section className={styles.top10Box} ref={wrapRef} aria-label="주간 인기글 썸네일 순환">
      <button
        className={styles.thumbBoxLarge}
        tabIndex={0}
        aria-label={`${currIdx + 1}위: ${curr?.title}`}
        onClick={() => router.push(`/community/post/${curr.id}`)}
        onKeyDown={e => ["Enter", " "].includes(e.key) && router.push(`/community/post/${curr.id}`)}
        style={{
          background: "none",
          border: "none",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 0,
        }}
      >
        <div
          className={styles.thumbImageLargeWrap}
          style={{
            opacity: fade ? 1 : 0,
            transition: "opacity 0.34s cubic-bezier(.6,1.5,.5,1)",
          }}
        >
          <Image
            src={imgSrc}
            alt={curr?.title || "썸네일"}
            fill
            quality={90}
            sizes="260px"
            priority
            placeholder="blur"
            blurDataURL={FALLBACK}
            style={{
              objectFit: "cover",
              borderRadius: "18px",
            }}
            className={styles.thumbImageLarge}
            onError={e => ((e.target as HTMLImageElement).src = FALLBACK)}
          />
        </div>
        <div className={styles.thumbTitleLarge}>
          <span className={styles.thumbRankLarge}>{currIdx + 1}</span>
          <span className={styles.thumbTitleLargeText}>
            {curr?.title?.length > 36 ? curr.title.slice(0, 36) + "..." : curr?.title}
          </span>
        </div>
      </button>
    </section>
  );
}
