"use client";

interface ActionButtonsProps {
  onApply: () => void;
  onShare: () => void;
}

export default function ActionButtons({ onApply, onShare }: ActionButtonsProps) {
  return (
    <div className="action-buttons">
      <button className="btn-pm" onClick={onApply}>
        온라인 신청하기
      </button>
      <button className="btn-secondary" onClick={onShare}>
        링크 공유하기
      </button>
      <button className="btn-secondary">
        신청
      </button>
    </div>
  );
}