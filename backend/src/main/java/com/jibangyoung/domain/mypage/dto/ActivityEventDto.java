package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

public record ActivityEventDto(
        Long userId,
        Integer regionId,
        String actionType,
        Long refId,
        Long parentRefId, // ← 추가
        Integer actionValue, // ← 추가
        Integer scoreDelta,
        String meta, // JSON string
        String ipAddr,
        String userAgent,
        String platform,
        String lang,
        String status,
        String memo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
