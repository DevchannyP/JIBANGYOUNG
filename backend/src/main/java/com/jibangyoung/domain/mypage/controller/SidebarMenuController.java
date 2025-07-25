package com.jibangyoung.domain.mypage.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.QuicklinkMenuItemDto;
import com.jibangyoung.domain.mypage.dto.SidebarMenuItemDto;
import com.jibangyoung.domain.mypage.support.SidebarMenuFactory;
import com.jibangyoung.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 마이페이지 메뉴/퀵링크 제공 API (CSR/SSR, 모바일까지 확장 대응)
 * - 실무 Swagger 문서, 예외, 공통 응답 패턴 완비
 */
@Tag(name = "마이페이지-사이드바", description = "마이페이지 메뉴/퀵링크 목록 API")
@RestController
@RequestMapping("/api/mypage/menu")
public class SidebarMenuController {

    @Operation(summary = "사이드바 메뉴 목록(권한별)")
    @GetMapping("/sidebar")
    public ApiResponse<List<SidebarMenuItemDto>> getSidebarMenu(
            @RequestParam(defaultValue = "USER") String role
    ) {
        List<SidebarMenuItemDto> result = SidebarMenuFactory.getSidebarMenu().stream()
            .filter(item -> item.roles() == null || item.roles().contains(role))
            .collect(Collectors.toList());
        return ApiResponse.success(result);
    }

    @Operation(summary = "사이드바 퀵링크 목록(권한별)")
    @GetMapping("/quicklinks")
    public ApiResponse<List<QuicklinkMenuItemDto>> getQuicklinks(
            @RequestParam(defaultValue = "USER") String role
    ) {
        List<QuicklinkMenuItemDto> result = SidebarMenuFactory.getQuicklinks().stream()
            .filter(item -> item.roles() == null || item.roles().contains(role))
            .collect(Collectors.toList());
        return ApiResponse.success(result);
    }
}
