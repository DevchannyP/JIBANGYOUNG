// app/dashboard/components/CardGrid.tsx
import styles from "./styles/CardGrid.module.css";

export default function CardGrid() {
  const cards = [
    {
      title: "[속보] 청년 정책자원 이벤트",
      desc: "5분 만에 신청되는 Big 이벤트를 놓치지 마세요.",
      isImage: true,
    },
    {
      title: "[속보] 청년 정책자원 이벤트",
      desc: "5분 만에 신청되는 Big 이벤트를 놓치지 마세요.",
      isImage: true,
    },
    {
      title: "서울 날씨 맞추면 100만원 지급...",
      desc: "",
      isImage: false,
    },
  ];

  return (
    <div className={styles.grid}>
      <div className={styles.cardLeft}>
        <h4 className={styles.cardTitle}>
          내게 맞는 정책 보러가기 <span>💛</span>
        </h4>
        <p className={styles.cardDesc}>
          청년을 위한 다양한 지방 정책, 내게 맞는 혜택을 쉽고 빠르게 찾아보세요.
        </p>
      </div>
      {cards.map((c, i) => (
        <div
          className={styles.card}
          key={i}
          tabIndex={0}
          role="article"
          aria-label={c.title}
        >
          {c.isImage ? (
            <div className={styles.cardImage} />
          ) : (
            <div className={styles.cardImageAlt}>{c.title[0]}</div>
          )}
          <div>
            <p className={styles.cardTitle}>{c.title}</p>
            {c.desc && <p className={styles.cardDesc}>{c.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
