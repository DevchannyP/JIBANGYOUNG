// libs/api/policy/recList.ts

import type { PolicyCard } from '@/types/api/policy.c';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchRecommendedPolicies(userId: string): Promise<PolicyCard[]> {
  const response = await axios.get(`${API_BASE_URL}/api/policy/recList?userId=${encodeURIComponent(userId)}`);
  return response.data;
}