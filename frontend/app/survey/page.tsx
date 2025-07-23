'use client';

import { useState } from 'react';
import './survey.css';
import SurveyHeader from './components/SurveyHeader';
import QuestionCard from './components/QuestionCard';
import NavigationButtons from './components/NavigationButtons';
import ProgressButton from './components/ProgressButton';

interface Question {
  id: number;
  title: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "성별이 어떻게 되나요?",
    options: ["남성", "여성", "답하고 싶지 않아요"]
  },
  {
    id: 2,
    title: "나이가 어떻게 되나요?",
    options: ["20대", "30대", "40대", "50대", "60대 이상"]
  },
  {
    id: 3,
    title: "거주 지역은 어디인가요?",
    options: ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]
  }
];

export default function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: optionIndex
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

  const handleRecommendPolicy = () => {
    console.log('정책 추천 요청:', answers);
    // 여기에 정책 추천 로직 구현
    alert('정책을 추천해드리겠습니다!');
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasAnswer = answers[questions[currentQuestion].id] !== undefined;

  return (
    <div className="survey-container">
      <SurveyHeader />
      
      <div className="survey-content">
        <QuestionCard
          question={questions[currentQuestion]}
          selectedOption={answers[questions[currentQuestion].id]}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestion + 1}
        />

        <NavigationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          showPrevious={currentQuestion > 0}
          showNext={!isLastQuestion && hasAnswer}
          disabled={!hasAnswer}
        />

        {isLastQuestion && hasAnswer && (
          <ProgressButton onClick={handleRecommendPolicy} />
        )}
      </div>
    </div>
  );
}