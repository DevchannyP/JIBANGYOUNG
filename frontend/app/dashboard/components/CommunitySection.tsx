import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/CommunitySection.module.css";

export default function CommunitySection({
  onScrollNext,
  onScrollPrev,
}: {
  onScrollNext?: () => void;
  onScrollPrev?: () => void;
}) {
  const [showGuide, setShowGuide] = useState(true);
  const firstRowRef = useRef<HTMLTableRowElement>(null);

  // 섹션 진입시 안내문구 2.2초간 노출
  useEffect(() => {
    const t = setTimeout(() => setShowGuide(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // 첫 행 자동 포커스(탭키)
  useEffect(() => {
    if (firstRowRef.current) {
      firstRowRef.current.focus();
    }
  }, []);

  // 샘플 데이터
  const tableData = [
    {
      title: "춘천 청년정책지역 뭐해요 임실 강원...",
      writer: "오빠네",
      views: 50,
      likes: 56,
    },
    {
      title: "서울 청년지원 정책 총정리 꿀팁",
      writer: "철수",
      views: 34,
      likes: 44,
    },
    { title: "대구 살기 좋은 동네는?", writer: "미미", views: 21, likes: 38 },
    {
      title: "강릉 정착 후기, 이 동네 어때요?",
      writer: "춘향",
      views: 19,
      likes: 25,
    },
    { title: "전주 청년창업 정보 요약", writer: "혁이", views: 28, likes: 31 },
  ];

  // 행 클릭시 (예시) 상세 이동
  const handleRowClick = (rowIdx: number) => {
    // 실제 라우팅 구현 시: router.push(`/community/${id}`)
    alert(`"${tableData[rowIdx].title}" 상세페이지로 이동`);
  };

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0, y: 75 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, type: "spring", bounce: 0.22 }}
      tabIndex={-1}
      aria-label="HOT 커뮤니티 인기글 섹션"
    >
      {/* 섹션 플로팅 안내 (섹션 진입시만 2초간) */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            className={styles.sectionGuide}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5 }}
            role="status"
            aria-live="polite"
          >
            <Flame size={20} style={{ marginRight: 6, color: "#ffae00" }} />
            지금 “커뮤니티 HOT 인기글” 영역입니다
          </motion.div>
        )}
      </AnimatePresence>
      {/* 헤더 + 섹션 아이콘 */}
      <div className={styles.headerRow}>
        <button
          className={styles.arrowBtn}
          onClick={onScrollPrev}
          aria-label="이전 섹션으로"
          tabIndex={0}
        >
          <ArrowLeft size={26} />
        </button>
        <span className={styles.title}>
          <Flame className={styles.icon} size={26} />
          커뮤니케이션 <span className={styles.hotText}>HOT</span>
        </span>
        <button
          className={styles.arrowBtn}
          onClick={onScrollNext}
          aria-label="다음 섹션으로"
          tabIndex={0}
        >
          <ArrowRight size={26} />
        </button>
      </div>
      {/* 카드 3개 - 테이블 */}
      <div className={styles.hotGrid}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={styles.hotTableBox}
            whileHover={{
              scale: 1.045,
              y: -5,
              boxShadow: "0 8px 36px #ffe14047",
            }}
            whileFocus={{ scale: 1.045, boxShadow: "0 8px 36px #ffe14047" }}
            transition={{ type: "spring", bounce: 0.22 }}
            tabIndex={0}
            aria-label={`월간 인기 ${i + 1} 테이블`}
          >
            <div className={styles.hotTableHeader}>
              <span className={styles.hotTableBadge}>월간 인기</span>
            </div>
            <table className={styles.hotTable} role="table">
              <thead>
                <tr>
                  <th scope="col">NO</th>
                  <th scope="col">제목</th>
                  <th scope="col">글쓴이</th>
                  <th scope="col">조회</th>
                  <th scope="col">추천</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    tabIndex={0}
                    className={styles.hotTableRow}
                    ref={rIdx === 0 && i === 0 ? firstRowRef : undefined}
                    onClick={() => handleRowClick(rIdx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleRowClick(rIdx);
                    }}
                    role="button"
                    aria-label={`${rIdx + 1}번째 인기글, ${row.title}`}
                    title={row.title}
                  >
                    <td>{rIdx + 1}</td>
                    <td className={styles.ellipsis}>{row.title}</td>
                    <td>{row.writer}</td>
                    <td>{row.views}</td>
                    <td>{row.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
