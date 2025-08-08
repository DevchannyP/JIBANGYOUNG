import { RecommendationResultDto } from '@/types/api/recommendation';
import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 추천 생성 (POST)
export async function createRecommendations(userId: number, responseId: number) {
  const accessToken = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/api/recommendation/${userId}/${responseId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`추천 생성 실패: ${errorText}`);
  }
}

// 추천 결과 조회 (GET)
export async function fetchRecommendations(userId: number, responseId: number): Promise<RecommendationResultDto[]> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const res = await axios.get(`${API_BASE_URL}/api/recommendation/${userId}/${responseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch recommendations', error);
    throw error;
  }
}

// 정책 리스트 조회
export async function fetchPolicies(userId: number, responseId: number, regionCode: string) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${API_BASE_URL}/api/recommendation/${userId}/${responseId}/${regionCode}/policy.c`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch policies', error);
    throw error;
  }
}

// 추천 사유 조회
export async function fetchRegionReason(userId: number, responseId: number, regionCode: string) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${API_BASE_URL}/api/recommendation/${userId}/${responseId}/${regionCode}/reason`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch region reason', error);
    throw error;
  }
}
