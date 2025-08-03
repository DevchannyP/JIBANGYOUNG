"use client";

interface ActionButtonsProps {
  onApply?: () => void;
  onShare: () => void;
}

export default function ActionButtons({ onApply, onShare }: ActionButtonsProps) {
  return (
    <div className="action-buttons">
      {/* ❷ onApply가 있을 때만 버튼 표시 */}
      {onApply && (
        <button className="btn-pm" onClick={onApply}>
          온라인 신청하기
        </button>
      )}
      <button className="btn-secondary" onClick={onShare}>
        링크 공유하기
      </button>
    </div>
  );
}