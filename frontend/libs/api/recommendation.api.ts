
import { RecommendationResultDto } from '@/types/api/recommendation';
import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 추천 생성 (POST, 설문 저장 직후 한 번만 실행)
export async function createRecommendations(userId: number, responseId: number) {
  const res = await fetch(`${API_BASE_URL}/api/recommendation/${userId}/${responseId}`, {
    method: "POST",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`추천 생성 실패: ${errorText}`);
  }
}

// 추천 결과 조회 (GET, 결과 페이지 및 새로고침에서 실행)
export async function fetchRecommendations(userId: number, responseId: number): Promise<RecommendationResultDto[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/recommendation/${userId}/${responseId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch recommendations', error);
    throw error;
  }
}