interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  showPrevious: boolean;
  showNext: boolean;
  disabled: boolean;
}

export default function NavigationButtons({
  onPrevious,
  onNext,
  showPrevious,
  showNext,
  disabled
}: NavigationButtonsProps) {
  return (
    <div className="navigation-buttons">
      {showPrevious && (
        <button 
          className="nav-button prev-button"
          onClick={onPrevious}
        >
          이전
        </button>
      )}
      
      {showNext && (
        <button 
          className="nav-button next-button"
          onClick={onNext}
          disabled={disabled}
        >
          다음
        </button>
      )}
    </div>
  );
}