'use client';

import { useState } from 'react';

interface Option {
  option_code: string;
  option_text: string;
  weight: number;
}

interface Question {
  question_code: string;
  question_text: string;
  filtering?: boolean;
  weighting?: boolean;
  infra?: boolean;
  input_type?: string;
  multiple?: boolean;
  options?: Option[];
}

interface AnswerObject {
  question_code: string;
  option_code: string; // string으로 통일
  answer_text: string;
  answer_weight: number;
}

interface QuestionCardProps {
  question: Question;
  selectedValue?: AnswerObject | AnswerObject[];
  onAnswerSelect: (value: AnswerObject | AnswerObject[]) => void;
  questionNumber: number;
}

export default function QuestionCard({
  question,
  selectedValue,
  onAnswerSelect,
  questionNumber,
}: QuestionCardProps) {
  const [multipleSelection, setMultipleSelection] = useState<AnswerObject[]>(
    Array.isArray(selectedValue) ? selectedValue : []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const answer: AnswerObject = {
      question_code: question.question_code,
      option_code: e.target.value, // 문자열로 저장
      answer_text: e.target.value,
      answer_weight: 0, // 가중치 없음
    };
    onAnswerSelect(answer);
  };

  const handleMultipleSelect = (option: Option) => {
    let newSelection: AnswerObject[];

    const existing = multipleSelection.find(
      (ans) => ans.option_code === option.option_code
    );

    if (option.option_code === '0014010') {
      // "해당없음" 선택 시
      newSelection = [
        {
          question_code: question.question_code,
          option_code: option.option_code,
          answer_text: option.option_text,
          answer_weight: option.weight,
        },
      ];
    } else {
      const current = multipleSelection.filter(
        (ans) => ans.option_code !== '0014010'
      );

      if (existing) {
        // 이미 선택된 경우 해제
        newSelection = current.filter(
          (ans) => ans.option_code !== option.option_code
        );
      } else {
        // 새 선택 추가
        newSelection = [
          ...current,
          {
            question_code: question.question_code,
            option_code: option.option_code,
            answer_text: option.option_text,
            answer_weight: option.weight,
          },
        ];
      }
    }

    setMultipleSelection(newSelection);
    onAnswerSelect(newSelection.length > 0 ? newSelection : []);
  };

  const handleSingleSelect = (option: Option) => {
    const answer: AnswerObject = {
      question_code: question.question_code,
      option_code: option.option_code,
      answer_text: option.option_text,
      answer_weight: option.weight,
    };
    onAnswerSelect(answer);
  };

  const isSelected = (optionCode: string): boolean => {
    if (question.multiple) {
      return multipleSelection.some((ans) => ans.option_code === optionCode);
    }
    return (
      (selectedValue as AnswerObject)?.option_code === optionCode ||
      false
    );
  };

  return (
    <div className="question-card">
      <div className="question-title">
        <span className="question-number">Q.{questionNumber}</span>{' '}
        {question.question_text}
      </div>

      <div className="question-type">
        {question.filtering && (
          <span className="type-badge filtering">수혜대상여부</span>
        )}
        {question.weighting && (
          <span className="type-badge weighting">관심정책</span>
        )}
        {question.infra && <span className="type-badge infra">인프라조사</span>}
        {question.multiple && (
          <span className="type-badge multiple">복수선택</span>
        )}
      </div>

      <div className="options-container">
        {question.input_type === 'number' ? (
          <div className="number-input-container">
            <input
              type="number"
              className="number-input"
              value={(selectedValue as AnswerObject)?.answer_text || ''}
              onChange={handleInputChange}
              placeholder="나이를 입력해주세요"
              min="0"
              max="120"
            />
            <span className="input-unit">세</span>
          </div>
        ) : (
          question.options?.map((option, index) => (
            <button
              key={option.option_code}
              className={`option-button ${
                isSelected(option.option_code) ? 'selected' : ''
              }`}
              onClick={() =>
                question.multiple
                  ? handleMultipleSelect(option)
                  : handleSingleSelect(option)
              }
            >
              <span className="option-number">{index + 1}.</span>
              <span className="option-text">{option.option_text}</span>
            </button>
          ))
        )}
      </div>

      {question.multiple && (
        <div className="multiple-help-text">
          * 해당하는 항목을 모두 선택해주세요. (해당없음 선택 시 다른 선택은
          해제됩니다)
        </div>
      )}
    </div>
  );
}
