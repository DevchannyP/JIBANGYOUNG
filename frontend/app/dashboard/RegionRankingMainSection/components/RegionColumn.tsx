import styles from "../RegionTabSlider.module.css";

interface RegionColumnProps {
  region: string;
  active?: boolean;
}

export default function RegionColumn({ region, active }: RegionColumnProps) {
  const items = Array(8).fill(region);

  return (
    <div className={`${styles.columnBox} ${active ? styles.columnActive : ""}`}>
      {items.map((item, i) => (
        <div key={i} className={styles.columnItem}>
          {item}
        </div>
      ))}
    </div>
  );
}
