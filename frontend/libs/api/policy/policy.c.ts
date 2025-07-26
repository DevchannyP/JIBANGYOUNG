import { PolicyCard } from '@/types/api/policy.c';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const fetchAllPolicies = async (): Promise<PolicyCard[]> => {
  console.log('API 호출 시작:', `${API_BASE_URL}/api/policy/policy.c`);
  try {
    const res = await axios.get(`${API_BASE_URL}/api/policy/policy.c`);
    console.log('API 응답 데이터:', res.data);
    return res.data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
};