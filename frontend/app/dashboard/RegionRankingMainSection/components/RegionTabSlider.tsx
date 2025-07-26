// app/dashboard/RegionRankingMainSection/components/RegionTabSlider.tsx
"use client";

import { fetchRegionDashTab, RegionDashCardDto } from "@/libs/api/dashboard/region.api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../RegionTabSlider.module.css";

// 변수/카운트/슬라이드 window 등은 건드리지 않음!
const CARD_COUNT = 9;
const MAX_REGIONS_PER_CARD = 3;
const SLIDE_WINDOW = 6;

const tabDataCache: Record<string, RegionDashCardDto[]> = {};

function splitRegionsToCards(list: RegionDashCardDto[]): RegionDashCardDto[][] {
  const res: RegionDashCardDto[][] = [];
  for (let i = 0; i < list.length; i += MAX_REGIONS_PER_CARD) res.push(list.slice(i, i + MAX_REGIONS_PER_CARD));
  while (res.length < CARD_COUNT) res.push([]);
  return res.slice(0, CARD_COUNT);
}

export default function RegionTabSlider({ regions: propRegions }: { regions?: string[] }) {
  const router = useRouter();
  const [regions, setRegions] = useState<string[]>(() => propRegions ?? []);
  const [current, setCurrent] = useState(0);
  const [cards, setCards] = useState<RegionDashCardDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (regions.length > 0) return;
    let ignore = false;
    import("@/libs/api/dashboard/region.api").then(({ fetchRegionDashSidoTabs }) =>
      fetchRegionDashSidoTabs().then((arr) => {
        if (!ignore) setRegions(arr);
      })
    );
    return () => { ignore = true; };
  }, [regions.length]);

  useEffect(() => {
    if (!regions.length) { setCards([]); return; }
    const regionKey = regions[current];
    if (tabDataCache[regionKey]) {
      setCards(tabDataCache[regionKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchRegionDashTab(regionKey)
      .then(data => {
        const list: RegionDashCardDto[] = Array.isArray(data?.regions) ? data.regions : (Array.isArray(data) ? data : []);
        tabDataCache[regionKey] = list;
        setCards(list);
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [regions, current]);

  const start = Math.max(0, Math.min(current - 1, Math.max(0, regions.length - SLIDE_WINDOW)));
  const visibleRegions = regions.slice(start, start + SLIDE_WINDOW);
  const cardGroups = splitRegionsToCards(cards);

  function RegionCard({
    group,
    cardIdx,
    isActive,
    onClick,
  }: {
    group: RegionDashCardDto[],
    cardIdx: number,
    isActive: boolean,
    onClick: () => void,
  }) {
    const label = group.map((r) => r.guGun1 + (r.guGun2 ? " " + r.guGun2 : "")).join(", ");
    return (
      <div
        className={
          styles.regionCard +
          (isActive ? ` ${styles.regionActive} ${styles.regionActiveShadow}` : "")
        }
        tabIndex={0}
        aria-label={label || `빈 카드 ${cardIdx + 1}`}
        title={label}
        onClick={group.length > 0 ? onClick : undefined}
        onKeyDown={e => {
          if (e.key === "Enter" && group[0]) onClick();
        }}
        style={{
          cursor: group.length > 0 ? "pointer" : "default",
        }}
      >
        <div className={styles.regionCardInner}>
          {group.length === 0 ? (
            <div className={styles.regionItemEmpty}>지역 없음</div>
          ) : (
            group.map((item, i) => (
              <div
                key={item.regionCode}
                className={styles.regionItem}
                tabIndex={-1}
                title={item.guGun1 + (item.guGun2 ? " " + item.guGun2 : "")}
                onClick={e => {
                  e.stopPropagation();
                  router.push(`/community/region/${item.regionCode}`);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    router.push(`/community/region/${item.regionCode}`);
                  }
                }}
              >
                <span className={styles.regionItemText}>
                  {item.guGun1}{item.guGun2 ? ` ${item.guGun2}` : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function RegionCard({
    group,
    cardIdx,
    isActive,
    onClick,
  }: {
    group: RegionDashCardDto[],
    cardIdx: number,
    isActive: boolean,
    onClick: () => void,
  }) {
    const label = group.map((r) => r.guGun1 + (r.guGun2 ? " " + r.guGun2 : "")).join(", ");
    return (
      <div
        className={
          styles.regionCard +
          (isActive ? ` ${styles.regionActive} ${styles.regionActiveShadow}` : "")
        }
        tabIndex={0}
        aria-label={label || `빈 카드 ${cardIdx + 1}`}
        title={label}
        onClick={group.length > 0 ? onClick : undefined}
        onKeyDown={e => {
          if (e.key === "Enter" && group[0]) onClick();
        }}
        style={{
          cursor: group.length > 0 ? "pointer" : "default",
        }}
      >
        <div className={styles.regionCardInner}>
          {group.length === 0 ? (
            <div className={styles.regionItemEmpty}>지역 없음</div>
          ) : (
            group.map((item, i) => (
              <div
                key={item.regionCode}
                className={styles.regionItem}
                tabIndex={-1}
                title={item.guGun1 + (item.guGun2 ? " " + item.guGun2 : "")}
                onClick={e => {
                  e.stopPropagation();
                  if (item.regionCode !== -1)
                    router.push(`/community/${item.regionCode}`);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && item.regionCode !== -1) {
                    router.push(`/community/${item.regionCode}`);
                  }
                }}
              >
                <span className={styles.regionItemText}>
                  {item.guGun1}{item.guGun2 ? ` ${item.guGun2}` : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bgWrap}>
      <div className={styles.sliderRoot}>
        <button
          className={styles.arrowBtn}
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          aria-label="이전 지역"
          type="button"
        >
          <ChevronLeft size={28} stroke="#232323" />
        </button>
        <div className={styles.tabsRow} role="tablist">
          {visibleRegions.map((name, idx) => {
            const realIdx = start + idx;
            return (
              <button
                key={name}
                className={`${styles.tabBtn} ${realIdx === current ? styles.tabActive : ""}`}
                onClick={() => setCurrent(realIdx)}
                tabIndex={0}
                role="tab"
                aria-selected={realIdx === current}
                aria-label={name}
                type="button"
                title={name}
              >
                {name.replace("특별시", "").replace("광역시", "").replace("도", "")}
              </button>
            );
          })}
        </div>
        <button
          className={styles.arrowBtn}
          onClick={() => setCurrent(Math.min(regions.length - 1, current + 1))}
          disabled={current === regions.length - 1}
          aria-label="다음 지역"
          type="button"
        >
          <ChevronRight size={28} stroke="#232323" />
        </button>
      </div>
      <div className={styles.cardsRow}>
        {loading
          ? Array.from({ length: CARD_COUNT }).map((_, idx) => (
              <div
                key={idx}
                className={styles.regionCard}
                style={{
                  background: "#fffbe6",
                  opacity: 0.6,
                  minHeight: 320,
                  minWidth: 188,
                  boxShadow: "0 4px 24px #ffe14055",
                }}
                aria-busy="true"
              >
                <div className={styles.regionCardInner}>
                  <span className={styles.skeletonBlock}
                    style={{
                      width: "72%",
                      height: 30,
                      background: "#ececec",
                      borderRadius: 8,
                      display: "inline-block"
                    }} />
                </div>
              </div>
            ))
          : cardGroups.map((group, cardIdx) => (
              <RegionCard
                key={cardIdx}
                group={group}
                cardIdx={cardIdx}
                isActive={cardIdx === 0}
                onClick={() => {
                  if (group[0]) router.push(`/community/region/${group[0].regionCode}`);
                }}
              />
            ))}
      </div>
    </div>
  );
}
