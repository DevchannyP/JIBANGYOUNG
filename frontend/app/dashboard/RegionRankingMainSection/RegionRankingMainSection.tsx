// 📁 app/(main)/components/RegionTabSliderMainSection.tsx
"use client";
import dynamic from "next/dynamic";
import styles from "./RegionTabSlider.module.css";

const RegionTabSlider = dynamic(() => import("./components/RegionTabSlider"), {
  ssr: false,
  loading: () => <div style={{ height: 240, background: "#ffe140" }} />,
});

export default function RegionTabSliderMainSection() {
  return (
    <section className={styles.rankingSectionRoot}>
      <RegionTabSlider />
    </section>
  );
}
