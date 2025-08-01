"use client";

import { fetchRegionDashTab, RegionDashCardDto } from "@/libs/api/dashboard/region.api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../RegionTabSlider.module.css";

const CARD_COUNT = 9;
const MAX_REGIONS_PER_CARD = 3;
const SLIDE_WINDOW = 6;

const tabDataCache: Record<string, RegionDashCardDto[]> = {};

// 카드 분할 함수
function splitRegionsToCards(list: RegionDashCardDto[]): RegionDashCardDto[][] {
  const res: RegionDashCardDto[][] = [];
  for (let i = 0; i < list.length; i += MAX_REGIONS_PER_CARD)
    res.push(list.slice(i, i + MAX_REGIONS_PER_CARD));
  return res;
}

// 세종시만 regionCode 36110, 나머지는 기존 방식
function createSelfRegionCard(sido: string, cards: RegionDashCardDto[]): RegionDashCardDto[] {
  if (sido === "세종시") {
    return [{
      regionCode: 36110,
      guGun1: "세종시",
      guGun2: "",
    }];
  }
  const found = cards.find((c) => c.guGun1 === sido);
  if (found) return [found];
  return [{
    regionCode: -1,
    guGun1: sido,
    guGun2: "",
  }];
}

export default function RegionTabSlider({ regions: propRegions }: { regions?: string[] }) {
  const router = useRouter();
  const [regions, setRegions] = useState<string[]>(() => propRegions ?? []);
  const [current, setCurrent] = useState(0); // 시도(탭) 인덱스
  const [cards, setCards] = useState<RegionDashCardDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardSlide, setCardSlide] = useState(0);

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
      setCardSlide(0);
      return;
    }
    setLoading(true);
    fetchRegionDashTab(regionKey)
      .then(data => {
        const list: RegionDashCardDto[] = Array.isArray(data?.regions) ? data.regions : (Array.isArray(data) ? data : []);
        tabDataCache[regionKey] = list;
        setCards(list);
        setCardSlide(0);
      })
      .catch(() => { setCards([]); setCardSlide(0); })
      .finally(() => setLoading(false));
  }, [regions, current]);

  // regionKey와 cards의 정보를 함께 활용해서 대체카드도 regionCode 기반으로 라우팅!
  const regionKey = regions[current] || "";
  const isCardEmpty = !loading && cards.length === 0 && regionKey;
  // 대체 카드도 regionCode 기반으로 생성
  const cardDataToShow: RegionDashCardDto[] = isCardEmpty
    ? createSelfRegionCard(regionKey, cards)
    : cards;

  const cardGroups = splitRegionsToCards(cardDataToShow);
  const totalCardPages = Math.max(1, Math.ceil(cardGroups.length / CARD_COUNT));
  const currentCardSliceStart = cardSlide * CARD_COUNT;
  const visibleCardGroups = cardGroups.slice(currentCardSliceStart, currentCardSliceStart + CARD_COUNT);

  // 탭(시도) 슬라이드 window
  const start = Math.max(0, Math.min(current - 1, Math.max(0, regions.length - SLIDE_WINDOW)));
  const visibleRegions = regions.slice(start, start + SLIDE_WINDOW);

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
                {name}
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
        {cardGroups.length > CARD_COUNT && (
          <button
            className={styles.arrowBtn}
            style={{ left: 0, position: "absolute", zIndex: 2, top: "50%", transform: "translateY(-50%)" }}
            onClick={() => setCardSlide((prev) => Math.max(0, prev - 1))}
            disabled={cardSlide === 0}
            aria-label="이전 카드 그룹"
            type="button"
          >
            <ChevronLeft size={24} stroke="#232323" />
          </button>
        )}
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
          : (
            visibleCardGroups.length > 0
              ? visibleCardGroups.map((group, cardIdx) => (
                  <RegionCard
                    key={cardIdx + currentCardSliceStart}
                    group={group}
                    cardIdx={cardIdx}
                    isActive={cardIdx === 0}
                    onClick={() => {
                      const first = group[0];
                      if (!first) return;
                      if (first.regionCode !== -1) {
                        router.push(`/community/${first.regionCode}`);
                      }
                    }}
                  />
                ))
              : null
          )}
        {cardGroups.length > CARD_COUNT && (
          <button
            className={styles.arrowBtn}
            style={{ right: 0, position: "absolute", zIndex: 2, top: "50%", transform: "translateY(-50%)" }}
            onClick={() => setCardSlide((prev) => Math.min(totalCardPages - 1, prev + 1))}
            disabled={cardSlide >= totalCardPages - 1}
            aria-label="다음 카드 그룹"
            type="button"
          >
            <ChevronRight size={24} stroke="#232323" />
          </button>
        )}
      </div>
    </div>
  );
}