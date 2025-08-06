// libs/api/policy/sync.ts

import { PolicyCard } from "@/types/api/policy.c";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const syncBookmarkedPolicies = async (userId: number, bookmarkedPolicyIds: number[]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/policy/sync`, {
    userId,
    bookmarkedPolicyIds,
  });
};

// ✅ userId로 찜한 정책 목록 가져오기 (policy_favorites 테이블 기반)
export const fetchUserBookmarkedPolicyCodes = async (
  userId: number
): Promise<number[]> => {
  const response = await axios.get<number[]>(
    `${API_BASE_URL}/api/policy/favorites/${userId}`
  );
  return response.data; // [101, 203, 305, ...]
};

// bookmarkedPolicyIds 배열 받아서 정책 상세 리스트 요
export async function fetchFavoritePoliciesByPolicyNos(bookmarkedPolicyIds: number[]): Promise<PolicyCard[]> {
  if (bookmarkedPolicyIds.length === 0) return [];

  const response = await axios.post<PolicyCard[]>(
    `${API_BASE_URL}/api/policy/favorites/policylist`,
    bookmarkedPolicyIds  // 배열 자체를 넘김
  );

  return response.data;
}