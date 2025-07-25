// app/policy-survey/types.ts

export interface TopCityData {
  rank: number;
  city: string;
  description: string;
  items: string[];
}

export interface Period {
  label: string;
  date: string;
  time: string;
  highlight: boolean;
}

export interface RecommendedData {
  id: number;
  category: string;
  title: string;
  tags: string[];
  periods: Period[];
}

export interface NewsData {
  id: number;
  category: string;
  title: string;
  date: string;
  imageUrl?: string;
  summary?: string;
}

export interface PolicySurveyPageProps {
  topCitiesData: TopCityData[];
  recommendedData: RecommendedData[];
  newsData: NewsData[];
}

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}