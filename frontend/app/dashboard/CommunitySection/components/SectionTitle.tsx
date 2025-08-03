import styles from "../CommunitySection.module.css";
// 커뮤니티 섹션 타이틀 컴포넌트
type Props = {
  align?: "left" | "center" | "right";
};
export default function SectionTitle({ align = "right" }: Props) {
  return (
    <div
      className={styles.titleWrap}
      style={{
        alignItems:
          align === "left"
            ? "flex-start"
            : align === "center"
              ? "center"
              : "flex-end",
      }}
    >
      <button className={styles.tabBtn}>커뮤니케이션</button>
      <span className={styles.titleSub}>
        우리 동네 우리들의{" "}
        <b className={styles.titleHighlight}>
          가장 <span className={styles.hot}>HOT</span> 이야기
        </b>
      </span>
    </div>
  );
}
