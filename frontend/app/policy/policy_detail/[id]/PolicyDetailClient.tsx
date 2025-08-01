"use client";

import { fetchPolicyDetail } from "@/libs/api/policy/policyDetail";
import type { PolicyDetailDto } from "@/types/api/policy";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./UpdatePolicyDetail.css";
import ActionButtons from "./components/ActionButtons";
import PolicyHeader from "./components/PolicyHeader";
import PolicyMainCard from "./components/PolicyMainCard";
import RelatedPoliciesSection from "./components/RelatedPoliciesSection";


interface PolicyDetailClientProps {
  initialData: PolicyDetailDto[] | null;
  policyId: number;
}

export default function PolicyDetailClient({ 
  initialData, 
  policyId 
}: PolicyDetailClientProps) {
  const router = useRouter();
  const { id } = useParams();
  const [policy, setPolicy] = useState<PolicyDetailDto[] | null>(initialData);
  const [loading, setLoading] = useState(!initialData); // SSR 데이터가 있으면 로딩 false
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedPolicies, setRelatedPolicies] = useState<PolicyDetailDto[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // CSR로 정책 데이터 가져오기 (SSR 실패 시 또는 재검증)
  useEffect(() => {
    if (!id) return;

    // SSR 데이터가 없는 경우에만 CSR로 fetch
    if (!initialData) {
      setLoading(true);
      fetchPolicyDetail(Number(id))
        .then((data) => {
          setPolicy(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching policy detail:", err);
          setError("정책 상세 정보를 불러오는데 실패했습니다.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, initialData]);

  // CSR로 관련 정책 데이터 가져오기
  useEffect(() => {
    if (!policy || policy.length === 0) return;

    const fetchRelatedPolicies = async () => {
      setLoadingRelated(true);
      try {
        // 관련 정책 API 호출 (예시)
        // const related = await fetchRelatedPolicies(policy[0].category, policyId);
        // setRelatedPolicies(related);
        
        // 임시 더미 데이터
        // const dummyRelated = [
        //   {
        //     NO: 2,
        //     plcy_nm: "청년 취업 지원 2025",
        //     deadline: "2025-03-31",
        //     dDay: 45,
        //     sidoName: "대전시",
        //     oper_inst_nm: "대전광역시청 청년정책과",
        //     plcy_sprt_cn: "청년 취업 지원금 지원",
        //     aply_url_addr: "https://example.com/apply2"
        //   },
        //   {
        //     NO: 3,
        //     plcy_nm: "청년 주택 지원 2025",
        //     deadline: "2025-04-15",
        //     dDay: 60,
        //     sidoName: "부산시",
        //     oper_inst_nm: "부산광역시 주택정책과",
        //     plcy_sprt_cn: "청년 주택 임대료 지원",
        //     aply_url_addr: "https://example.com/apply3"
        //   },
        //   {
        //     NO: 4,
        //     plcy_nm: "청년 창업 지원 2025",
        //     deadline: "2025-05-01",
        //     dDay: 75,
        //     sidoName: "인천시",
        //     oper_inst_nm: "인천광역시 경제산업국",
        //     plcy_sprt_cn: "청년 창업 자금 지원",
        //     aply_url_addr: "https://example.com/apply4"
        //   },
        //   {
        //     NO: 5,
        //     plcy_nm: "청년 교육 지원 2025",
        //     deadline: "2025-06-30",
        //     dDay: 120,
        //     sidoName: "광주시",
        //     oper_inst_nm: "광주광역시 교육청",
        //     plcy_sprt_cn: "청년 직업교육 지원",
        //     aply_url_addr: "https://example.com/apply5"
        //   }
        // ] as PolicyDetailDto[];
        
        // setRelatedPolicies(dummyRelated);
      } catch (error) {
        console.error("Error fetching related policies:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedPolicies();
  }, [policy, policyId]);

  const handleBack = () => {
    router.back();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 북마크 API 호출
  };

  const handleApply = () => {
    if (policy && policy[0]?.aply_url_addr) {
      window.open(policy[0].aply_url_addr, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: policy?.[0]?.plcy_nm,
        text: `${policy?.[0]?.plcy_nm} - ${policy?.[0]?.plcy_sprt_cn}`,
        url: window.location.href,
      });
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!policy || policy.length === 0) return <div className="error-message">정책을 찾을 수 없습니다.</div>;

  const currentPolicy = policy[0];

  return (
    <>
      <PolicyHeader onBack={handleBack} />
      
      <PolicyMainCard 
        policy={currentPolicy}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
      />

      <RelatedPoliciesSection 
        policies={relatedPolicies}
        loading={loadingRelated}
      />

      <ActionButtons 
        onApply={handleApply}
        onShare={handleShare}
      />
    </>
  );
}