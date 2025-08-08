// libs/api/policy/sync.ts

import { PolicyCard } from "@/types/api/policy.c";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const syncBookmarkedPolicies = async (userId: number, bookmarkedPolicyIds: number[]): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');

  await axios.post(
    `${API_BASE_URL}/api/policy/sync`,
    { userId, bookmarkedPolicyIds },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};


// ✅ userId로 찜한 정책 목록 가져오기 (policy_favorites 테이블 기반)
export const fetchUserBookmarkedPolicyCodes = async (
  userId: number
): Promise<number[]> => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await axios.get<number[]>(
    `${API_BASE_URL}/api/policy/favorites/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// bookmarkedPolicyIds 배열 받아서 정책 찜 리스트 보여주기 
export async function fetchFavoritePoliciesByPolicyNos(bookmarkedPolicyIds: number[]): Promise<PolicyCard[]> {
  if (bookmarkedPolicyIds.length === 0) return [];

  const accessToken = localStorage.getItem('accessToken');

  const response = await axios.post<PolicyCard[]>(
    `${API_BASE_URL}/api/policy/favorites/policylist`,
    bookmarkedPolicyIds,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}