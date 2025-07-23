// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { fetchMyProfile, UserProfileDto } from "../../libs/api/mypage.api";

/**
 * 내 프로필 정보(useQuery) 커스텀 훅
 * - GET /api/mypage/me (MyPageController 기준)
 * - 10분간 stale, 1회 자동 재시도
 */
export function useUser() {
  return useQuery<UserProfileDto>({
    queryKey: ["mypage", "me"],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 10, // 10분
    retry: 1,
  });
}
