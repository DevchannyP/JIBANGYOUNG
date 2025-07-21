import axios from 'axios';
import { PolicyCard } from '@/types/api/policy.c';

const API_BASE_URL = 'http://localhost:8080'; // 백엔드 주소

// 지역 코드로 정책 필터링
export const fetchPoliciesByRegion = async (region_code: number): Promise<PolicyCard[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/policy/region.api`, {
      params: { region_code }
    });
    console.log("호출 데이터:" + res.data)
    return res.data;
  } catch (error) {
    console.error('지역별 정책 API 호출 실패:', error);
    throw error;
  }
};