package com.jibangyoung.domain.mypage.dto;

import java.util.List;

/**
 * 마이페이지 사이드바 상단 퀵링크 항목 DTO
 */
public record QuicklinkMenuItemDto(
    String key,
    String label,
    String path,
    List<String> roles
) {}
