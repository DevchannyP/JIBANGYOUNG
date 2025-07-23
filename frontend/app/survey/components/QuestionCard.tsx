interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    options: string[];
  };
  selectedOption?: number;
  onAnswerSelect: (optionIndex: number) => void;
  questionNumber: number;
}

export default function QuestionCard({ 
  question, 
  selectedOption, 
  onAnswerSelect, 
  questionNumber 
}: QuestionCardProps) {
  return (
    <div className="question-card">
      <div className="question-title">
        <span className="question-number">Q.{questionNumber}</span> {question.title}
      </div>
      
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedOption === index ? 'selected' : ''}`}
            onClick={() => onAnswerSelect(index)}
          >
            {index + 1}. {option}
          </button>
        ))}
      </div>
    </div>
  );
}