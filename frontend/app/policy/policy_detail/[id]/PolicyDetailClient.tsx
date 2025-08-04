'use client';

import { fetchPolicyDetail } from "@/libs/api/policy/policyDetail";
import { syncBookmarkedPolicies } from "@/libs/api/policy/sync";
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
  // userId prop 제거
}

export default function PolicyDetailClient({ 
  initialData, 
  policyId,
}: PolicyDetailClientProps) {
  const router = useRouter();
  const { id } = useParams();

  // userId 상태 추가, localStorage에서 불러오기
  const [userId, setUserId] = useState<number | null>(null);

  const [policy, setPolicy] = useState<PolicyDetailDto[] | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  // localStorage에서 userId 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(Number(storedUserId));
        }
      } catch {
        setUserId(null);
      }
    }
  }, []);

  // --- localStorage에서 해당 정책 북마크 상태 복원 ---
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bookmarkedPolicyIds");
        if (stored) {
          const bookmarkedIds: number[] = JSON.parse(stored);
          return bookmarkedIds.includes(policyId);
        }
      } catch {
        // 무시
      }
    }
    return false;
  });

  const [relatedPolicies, setRelatedPolicies] = useState<PolicyDetailDto[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (!id) return;

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

  useEffect(() => {
    if (!policy || policy.length === 0) return;

    const fetchRelatedPolicies = async () => {
      setLoadingRelated(true);
      try {
        // 관련 정책 API 호출 로직 필요시 작성
      } catch (error) {
        console.error("Error fetching related policies:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedPolicies();
  }, [policy, policyId]);

  // 5분마다 localStorage 북마크 동기화 서버 전송 (userId 포함)
  useEffect(() => {
    const syncBookmarksToServer = async () => {
      if (typeof window === 'undefined' || userId === null) return;

      try {
        const stored = localStorage.getItem('bookmarkedPolicyIds');
        const bookmarkedIds = stored ? JSON.parse(stored) : [];

        await syncBookmarkedPolicies(userId, bookmarkedIds);
      } catch (error) {
        console.error('북마크 동기화 실패:', error);
      }
    };

    const intervalId = setInterval(syncBookmarksToServer, 1 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [userId]);

  const handleBack = () => {
    router.back();
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => {
      const nextState = !prev;

      // localStorage 업데이트
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("bookmarkedPolicyIds");
          let bookmarkedIds: number[] = stored ? JSON.parse(stored) : [];

          if (nextState) {
            if (!bookmarkedIds.includes(policyId)) {
              bookmarkedIds.push(policyId);
            }
          } else {
            bookmarkedIds = bookmarkedIds.filter(id => id !== policyId);
          }

          localStorage.setItem("bookmarkedPolicyIds", JSON.stringify(bookmarkedIds));
        } catch {
          // 무시
        }
      }

      return nextState;
    });
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
        onApply={currentPolicy.aply_url_addr ? handleApply : undefined}
        onShare={handleShare}
      />
    </>
  );
}
