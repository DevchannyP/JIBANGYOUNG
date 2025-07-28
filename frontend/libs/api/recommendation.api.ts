// libs/api/recommendation/recommendation.api.ts
export async function fetchRecommendations(userId: number, responseId: number) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/api/recommendation/${userId}/${responseId}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`추천 결과 조회 실패: ${errorText}`);
  }

  return await res.json();
}