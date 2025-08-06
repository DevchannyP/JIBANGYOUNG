"use client";

import dynamic from "next/dynamic";
import SkeletonLoader from "../totalPolicies/skeleton";

const PolicyFavoritesClient = dynamic(() => import("./policyFavoritesClient"), {
  ssr: false,
  loading: () => <SkeletonLoader />,
});

export default function PolicyFavoritesWrapper({ serverState }: { serverState: any }) {
  return <PolicyFavoritesClient serverState={serverState} />;
}
