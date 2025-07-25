package com.jibangyoung.domain.mypage.support;

import com.jibangyoung.domain.mypage.dto.SidebarMenuItemDto;
import com.jibangyoung.domain.mypage.dto.QuicklinkMenuItemDto;

import java.util.List;

/**
 * 메뉴/퀵링크 데이터의 싱글톤 팩토리
 * - DB 없이 코드 일원화, 확장/테스트/인젝션 쉬움
 * - 실무에선 캐시/DB로 쉽게 전환 가능
 */
public class SidebarMenuFactory {

    // 사이드바 메뉴
    public static List<SidebarMenuItemDto> getSidebarMenu() {
        return List.of(
            new SidebarMenuItemDto("edit", "프로필 수정", false, null, null),
            new SidebarMenuItemDto("score", "지역별 점수", false, null, null),
            new SidebarMenuItemDto("posts", "내 게시글", false, null, null),
            new SidebarMenuItemDto("comments", "내 댓글보기", false, null, null),
            new SidebarMenuItemDto("surveys", "내 설문 이력", false, null, null),
            new SidebarMenuItemDto("favorites", "관심지역 알림", false, null, null),
            new SidebarMenuItemDto("alerts", "내 신고이력", false, null, null),
            new SidebarMenuItemDto("mentorApply", "멘토신청/멘토 공지사항", true, "/mentor/apply", List.of("MENTOR_A", "MENTOR_B", "MENTOR_C", "ADMIN")),
            new SidebarMenuItemDto("policyFavorite", "찜 정책", true, "/policy/favorite", null)
        );
    }

    // 퀵링크 메뉴
    public static List<QuicklinkMenuItemDto> getQuicklinks() {
        return List.of(
            new QuicklinkMenuItemDto("mentorDashboard", "멘토 대시보드", "/mentor/dashboard", List.of("MENTOR_A", "MENTOR_B", "MENTOR_C", "ADMIN")),
            new QuicklinkMenuItemDto("adminDashboard", "관리자 대시보드", "/admin/dashboard", List.of("ADMIN")),
            new QuicklinkMenuItemDto("regionRecommend", "추천지역 바로가기", "/region/recommend", null)
        );
    }
}
