'use client';

import { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import NavigationButtons from './components/NavigationButtons';
import ProgressButton from './components/ProgressButton';
import './survey.css';

interface AnswerObject {
  question_code: string;
  option_code: string | number;
  answer_text: string;
  answer_weight: number;
}

interface Option {
  option_code: string;
  option_text: string;
  weight: number;
}

interface Question {
  question_code: string;
  question_text: string;
  multiple?: boolean;
  input_type?: string;
  options?: Option[];
}

interface SurveyClientProps {
  questions: Question[];
}

export default function SurveyClient({ questions }: SurveyClientProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: AnswerObject | AnswerObject[] }>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAnswerSelect = (value: AnswerObject | AnswerObject[]) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].question_code]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // 설문 응답 저장 API 호출
  const handleSaveAnswer = async () => {
    try {
      // answers 객체를 배열로 변환
      const payload = Object.values(answers).flat();

      const response = await fetch('/api/survey/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      });

      if (!response.ok) throw new Error('저장 실패');
      alert('설문이 완료되었습니다.');
      window.location.href = '../policy/custom_policies';
    } catch (error) {
      console.error('설문 저장 오류:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentQuestionCode = questions[currentQuestion]?.question_code;
  const hasAnswer =
    answers[currentQuestionCode] !== undefined &&
    answers[currentQuestionCode] !== null &&
    (Array.isArray(answers[currentQuestionCode])
      ? (answers[currentQuestionCode] as AnswerObject[]).length > 0
      : true);

  if (!isHydrated) {
    return (
      <div className="survey-content">
        <div className="question-card">
          <div className="question-title">설문을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-content">
      {questions[currentQuestion] && (
        <>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="progress-text">
            {currentQuestion + 1} / {questions.length}
          </div>

          <QuestionCard
            question={questions[currentQuestion]}
            selectedValue={answers[currentQuestionCode]}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentQuestion + 1}
          />
        </>
      )}

      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        showPrevious={currentQuestion > 0}
        showNext={!isLastQuestion && hasAnswer}
        disabled={!hasAnswer}
      />

      {isLastQuestion && hasAnswer && (
        <ProgressButton onClick={handleSaveAnswer} />
      )}
    </div>
  );
}
