// app/survey/page.tsx (Server Component)
import SurveyClient from './surveyClient';
import { Metadata } from 'next';
import surveyQuestions from './survey_question.json';

export const metadata: Metadata = {
  title: '정책 추천 설문조사',
  description: '나에게 맞는 정책을 찾아보세요',
};

export default async function SurveyPage() {
  // JSON 파일에서 질문 데이터를 가져옴
  const questions = surveyQuestions;

  return (
    <>
      {/* SEO를 위한 초기 HTML 구조 서버 렌더링 */}
      <div className="survey-container">
        <div className="survey-header">
          <h1>
            나에게 맞는 <span className="highlight">정책</span>을 확인해볼까요?
          </h1>
        </div>
        
        {/* 클라이언트 컴포넌트에 데이터 전달 */}
        <SurveyClient questions={questions} />
      </div>
    </>
  );
}