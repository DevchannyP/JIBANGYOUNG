import React from 'react';
import '../recommendation.css';

interface FooterActionsProps {
  onViewAllPolicies: () => void;
  onRetakeSurvey: () => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  onViewAllPolicies,
  onRetakeSurvey,
}) => {
  return (
    <div className="footer-actions">
      <button className="btn primary" onClick={onViewAllPolicies}>
        전체 정책 보기
      </button>
      <button className="btn secondary" onClick={onRetakeSurvey}>
        설문 다시 하기
      </button>
    </div>
  );
};

export default FooterActions;