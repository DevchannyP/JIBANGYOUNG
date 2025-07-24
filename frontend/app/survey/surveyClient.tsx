'use client';

import { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import NavigationButtons from './components/NavigationButtons';
import ProgressButton from './components/ProgressButton';
import './survey.css';
import { saveSurveyAnswers } from '@/libs/api/survey/surveyAnswer';

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

interface AnswerFormat {
  answers: {
    [questionCode: string]: {
      value: string | number | (string | number)[];
      text?: string | string[];
      weight?: number | number[];
      timestamp: number;
    };
  };
  metadata: {
    completedAt: string;
    duration: number;
    userAgent: string;
    sessionId: string;
  };
}

// rawAnswers 상태 (AnswerObject or AnswerObject[]) → AnswerFormat 변환 함수
function transformToAnswerFormat(rawAnswers: { [key: string]: AnswerObject | AnswerObject[] }): AnswerFormat {
  const now = Date.now();

  const metadata = {
    completedAt: new Date().toISOString(),
    duration: 1234,
    userAgent: navigator.userAgent,
    sessionId: 'session-id-example',
  };

  const answers: AnswerFormat['answers'] = {};

  Object.entries(rawAnswers).forEach(([questionCode, answerValue]) => {
    if (Array.isArray(answerValue)) {
      // 복수 선택: value는 option_code 배열, text는 answer_text 배열, weight는 answer_weight 배열
      answers[questionCode] = {
        value: answerValue.map((ans) => ans.option_code),
        text: answerValue.map((ans) => ans.answer_text),
        weight: answerValue.map((ans) => ans.answer_weight),
        timestamp: now,
      };
    } else {
      // 단일 선택 또는 입력
      answers[questionCode] = {
        value: answerValue.option_code,
        text: answerValue.answer_text,
        weight: answerValue.answer_weight,
        timestamp: now,
      };
    }
  });

  return { answers, metadata };
}

export default function SurveyClient({ questions }: SurveyClientProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: AnswerObject | AnswerObject[] }>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAnswerSelect = (value: AnswerObject | AnswerObject[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].question_code]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

const handleSaveAnswer = async () => {
  try {
    const payload = transformToAnswerFormat(answers);
    console.log('전송 payload:', payload);

    const result = await saveSurveyAnswers(payload);

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
            />
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

      {isLastQuestion && hasAnswer && <ProgressButton onClick={handleSaveAnswer} />}
    </div>
  );
}
