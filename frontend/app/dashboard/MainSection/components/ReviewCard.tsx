"use client";

import { getPostUrl } from "@/libs/api/dashboard/monthlyHot.api";
import clsx from "clsx"; // tailwind 없이 className 동적 제어
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../MainSection.module.css";
import { useReviewTop3Query } from "./useReviewTop3Query";

const FALLBACK_THUMBNAIL = "/default-review-thumb.webp";

interface ReviewPostDto {
  id: number;
  regionId: number;
  title: string;
  content: string;
  author: string;
  regionName: string;
  thumbnailUrl?: string | null;
}

export default function ReviewCard() {
  const router = useRouter();
  const { data, isLoading, isError } = useReviewTop3Query();

  return (
    <section className={styles.reviewSectionUp}>
      <div className={styles.reviewHeaderRow}>
        <span className={styles.reviewSectionTitleUp}>인기 정착 후기</span>
        <span className={styles.reviewSectionHeart} aria-hidden>
          💛
        </span>
      </div>

      <div className={styles.reviewCardListRowUp}>
        {/* Loading */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={clsx(styles.reviewCardItemUp, styles.reviewSkeleton)}>
              <div className={styles.reviewThumbSkeletonUp} />
              <div className={styles.reviewTextSkeletonUp} style={{ width: "88%" }} />
              <div className={styles.reviewTextSkeletonUp} style={{ width: "54%" }} />
            </div>
          ))}

        {/* Error */}
        {isError && (
          <div className={clsx(styles.reviewCardItemUp, styles.reviewError)}>
            인기 후기를 불러올 수 없습니다.
          </div>
        )}

        {/* Data */}
        {Array.isArray(data) && data.length > 0 ? (
          data.map((row: ReviewPostDto, idx: number) => {
            const canClick = !!row.regionId && !!row.id;
            const postUrl = getPostUrl(row);
            const imageSrc =
              row.thumbnailUrl && row.thumbnailUrl.trim() !== ""
                ? row.thumbnailUrl
                : FALLBACK_THUMBNAIL;

            return (
              <div
                key={row.id}
                tabIndex={canClick ? 0 : -1}
                className={clsx(
                  styles.reviewCardItemUp,
                  canClick && styles.reviewCardItemActiveUp
                )}
                role={canClick ? "button" : undefined}
                aria-label={
                  canClick
                    ? `${idx + 1}위 ${row.title} (${row.regionName}, 클릭 시 상세보기)`
                    : `${idx + 1}위 ${row.title} (상세 이동 불가)`
                }
                title={row.title}
                style={{
                  cursor: canClick ? "pointer" : "not-allowed",
                  opacity: canClick ? 1 : 0.45,
                  outline: "none",
                  transition: "box-shadow .18s, transform .16s",
                }}
                onClick={() => canClick && postUrl && router.push(postUrl)}
                onKeyDown={e =>
                  canClick && postUrl && ["Enter", " "].includes(e.key) && router.push(postUrl)
                }
              >
                <div className={styles.reviewThumbWrapUp}>
                  <Image
                    className={styles.reviewCardThumbUp}
                    src={imageSrc}
                    alt={row.title}
                    draggable={false}
                    loading="lazy"
                    width={120}
                    height={90}
                    style={{
                      objectFit: "cover",
                      borderRadius: "14px",
                      background: "#F6F6F6",
                      boxShadow: "0 2px 14px #eee",
                      transition: "transform .17s",
                    }}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== FALLBACK_THUMBNAIL) target.src = FALLBACK_THUMBNAIL;
                    }}
                  />
                  <span className={styles.reviewRankBadgeUp}>{idx + 1}</span>
                </div>
                <div className={styles.reviewCardTextBoxUp}>
                  <div className={styles.reviewCardTitleUp}>
                    {row.title.length > 18 ? row.title.slice(0, 18) + "..." : row.title}
                  </div>
                  <div className={styles.reviewCardSummaryUp}>
                    {row.content.length > 38 ? row.content.slice(0, 38) + "..." : row.content}
                  </div>
                  <div className={styles.reviewCardMetaUp}>
                    <span className={styles.metaRegion}>{row.regionName}</span>
                    <span className={styles.metaDot}>·</span>
                    <span className={styles.metaAuthor}>{row.author}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : !isLoading && !isError ? (
          <div className={styles.reviewCardItemUp} style={{ textAlign: "center", color: "#888" }}>
            최근 1개월간 인기 후기가 없습니다.
          </div>
        ) : null}
      </div>
    </section>
  );
}
