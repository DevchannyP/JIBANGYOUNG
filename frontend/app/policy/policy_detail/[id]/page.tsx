import { fetchPolicyDetail } from "@/libs/api/policy/policyDetail";
import { Suspense } from "react";
import PolicyDetailClient from "./PolicyDetailClient";
import PolicyDetailSkeleton from "./components/PolicyDetailSkeleton";


interface PolicyDetailPageProps {
  params: Promise<{ id: string }>;
}

// SSR로 초기 데이터 fetch (옵셔널)
async function getInitialPolicyData(id: number) {
  try {
    const data = await fetchPolicyDetail(id);
    return data;
  } catch (error) {
    console.error("SSR Error fetching policy detail:", error);
    return null; // SSR 실패 시 CSR로 fallback
  }
}

export default async function PolicyDetailPage({ params }: PolicyDetailPageProps) {
  const policyId =  Number((await params).id);
  
  // SSR로 초기 데이터 시도 (실패 시 null)
  const initialData = await getInitialPolicyData(policyId);

  return (
    <div className="policy-detail-container">
      <Suspense fallback={<PolicyDetailSkeleton />}>
        <PolicyDetailClient 
          initialData={initialData} 
          policyId={policyId}
        />
      </Suspense>
    </div>
  );
}