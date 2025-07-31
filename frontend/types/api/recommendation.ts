import { PolicyCard } from './policy.c';

export interface RecommendationResultDto {
  no: number;
  rankGroup: number;
  rank: number;
  regionCode: number;
  regionName: string;
  regionDescription: string[]; // 인프라 등급 텍스트 배열
  policies: PolicyCard[];      // 정책 리스트
}