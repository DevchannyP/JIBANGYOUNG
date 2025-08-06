"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "../total_policy.module.css";

import loadingImg from "@/public/social/mascots/admin_mascot.png"; 
import SkeletonLoader from "./skeleton";
// public 폴더에 이미지 복사 후 경로 수정 필요

const PolicyClient = dynamic(() => import("./totalPolicyClient"), {
  ssr: false,
  loading: () => <SkeletonLoader />,
});

export default function PolicyClientWrapper({ serverState }: { serverState: any }) {
  return <PolicyClient serverState={serverState} />;
}

