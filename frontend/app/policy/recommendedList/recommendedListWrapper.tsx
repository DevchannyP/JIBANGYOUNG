"use client";

import dynamic from "next/dynamic";
import SkeletonLoader from "../totalPolicies/skeleton";

const RecommendedListClient = dynamic(() => import("./recommendedListClient"), {
  ssr: false,
  loading: () => <SkeletonLoader />,
});

export default function RecommendedListWrapper({ serverState }: { serverState: any }) {
  return <RecommendedListClient serverState={serverState} />;
}
