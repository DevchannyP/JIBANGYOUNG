'use client';

import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
  userId?: Number;
  responseId?: Number;
  regionCode?: Number;
}

export function ActionButtons({ userId, responseId, regionCode }: ActionButtonsProps) {
  const router = useRouter();

  const TotalPolicy = async () => {
    router.push('/policy/totalPolicies');
  };

  const handleViewOtherRegions = () => {
    router.back();
  };

  const handleGoSurvey= () => {
    router.push('/survey/');
  };

  return (
    <div className="action-buttons">
      <button
        onClick={TotalPolicy}
        className="action-button primary"
      >
        전체 정책 보러가기
      </button>

      <button
        onClick={handleViewOtherRegions}
        className="action-button secondary"
      >
        ← 이전 페이지로 돌아가기
      </button>

      <button
        onClick={handleGoSurvey}
        className="action-button tertiary"
      >
        설문조사 다시하기
      </button>
    </div>
  );
}
