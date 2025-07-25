package com.jibangyoung.domain.mypage.dto;

import java.util.List;

/**
 * 마이페이지 사이드바 메뉴 항목 DTO
 * - 프론트 SidebarMenuItem과 1:1 매칭
 */
public record SidebarMenuItemDto(
    String key,
    String label,
    Boolean external,
    String path,
    List<String> roles
) {}
