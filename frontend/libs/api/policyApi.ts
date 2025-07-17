import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // 백엔드 서버 포트에 맞게 설정

export interface Policy {
  no: number;
  plcyNm: string;
}

export const fetchAllPolicies = async (): Promise<Policy[]> => {
  try {
    console.log('API 호출 시작:', `${API_BASE_URL}/api/policyApi`);
    const res = await axios.get(`${API_BASE_URL}/api/policyApi`);
    console.log('API 응답:', res.data);
    return res.data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    
    // AxiosError 타입 체크
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버가 응답했지만 오류 상태 코드
        console.error('응답 상태:', error.response.status);
        console.error('응답 데이터:', error.response.data);
        console.error('응답 헤더:', error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못함
        console.error('요청 실패 (응답 없음):', error.request);
        console.error('네트워크 오류 또는 서버 미응답');
      } else {
        // 요청 설정 중 오류 발생
        console.error('요청 설정 오류:', error.message);
      }
    } else {
      // 일반 오류
      console.error('알 수 없는 오류:', error);
    }
    
    throw error;
  }
};