interface ProgressButtonProps {
  onClick: () => void;
}

export default function ProgressButton({ onClick }: ProgressButtonProps) {
  return (
    <div className="progress-button-container">
      <button className="progress-button" onClick={onClick}>
        추천 정책과 정책 확인하기
      </button>
    </div>
  );
}