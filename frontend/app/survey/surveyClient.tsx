'use client';

import { saveSurveyAnswers } from '@/libs/api/survey/surveyAnswer';
import { useEffect, useState } from 'react';
import NavigationButtons from './components/NavigationButtons';
import ProgressButton from './components/ProgressButton';
import QuestionCard from './components/QuestionCard';
import './survey.css';

interface AnswerObject {
  question_code: string;
  option_code: string; // string으로 통일
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
      value: string | string[]; // 항상 string 유지
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

// rawAnswers → AnswerFormat 변환
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
      answers[questionCode] = {
        value: answerValue.map((ans) => String(ans.option_code)),
        text: answerValue.map((ans) => ans.answer_text),
        weight: answerValue.map((ans) => parseFloat(String(ans.answer_weight))),
        timestamp: now,
      };
    } else {
      answers[questionCode] = {
        value: String(answerValue.option_code),
        text: answerValue.answer_text,
        weight: parseFloat(String(answerValue.answer_weight)),
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

      const {userId, responseId} = await saveSurveyAnswers(payload);

      alert('설문이 완료되었습니다.');
      window.location.href = `../recommendation/${userId}/${responseId}`;
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
