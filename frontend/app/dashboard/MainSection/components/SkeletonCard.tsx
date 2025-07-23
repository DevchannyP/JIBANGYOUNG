// 📁 app/(main)/MainSection/components/SkeletonCard.tsx
import styles from "../MainSection.module.css";

type CardType = "policy" | "rank" | "sub" | "thumb" | "top10";
export default function SkeletonCard({ type }: { type: CardType }) {
  return (
    <div
      className={`${styles[`${type}Card`]} ${styles.animatePulse}`}
      aria-hidden
    />
  );
}
