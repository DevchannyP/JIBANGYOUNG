// libs/api/survey/surveyAnswer.ts
import { AnswerFormat } from '@/types/api/survey_a';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function saveSurveyAnswers(payload: AnswerFormat) {
  const accessToken = localStorage.getItem('accessToken'); 
  try {
    const response = await fetch(`${API_BASE_URL}/api/survey/surveyAnswer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 요청 실패: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('설문 저장 API 호출 중 오류:', error);
    throw error;
  }
}
