import { PolicyResponseDto } from '@/types/api/policy';
import { Policy } from '@/types/api/policy';

// API 응답을 프론트 전용 타입으로 변환
export const convertToPolicy = (dto: PolicyResponseDto): Policy => ({
  No: dto.No,
  plcyNm: dto.plcyNm,
  bookmarked: false, // 초기값은 false
});