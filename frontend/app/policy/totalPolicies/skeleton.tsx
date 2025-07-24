// components/SkeletonLoader.tsx
"use client";

import Image from "next/image";
import styles from "../total_policy.module.css";
import loadingImg from "@/public/social/mascots/admin_mascot.png";

export default function SkeletonLoader() {
  return (
    <div
      className={styles.loading}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Image
        src={loadingImg}
        alt="Loading"
        width={300}
        height={300}
        priority
        style={{ marginBottom: "1.5rem" }}
      />
      <h1 className={styles.loadingText}>데이터를 불러오는 중...</h1>
    </div>
  );
}