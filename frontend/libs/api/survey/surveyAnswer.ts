// libs/api/survey/surveyAnswer.ts

export interface SurveyAnswersPayload {
  answers: { [questionCode: string]: any };
  // 필요하면 userId 같은 추가 필드도 여기에 포함 가능
  
}
const API_BASE_URL = "http://localhost:8080";

export async function saveSurveyAnswers(payload: SurveyAnswersPayload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/survey/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
