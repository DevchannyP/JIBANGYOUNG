package com.jibangyoung.domain.mypage.dto;

import com.jibangyoung.domain.mypage.entity.Alert;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * 관심지역 알림 Slice Projection DTO
 * - API/타입 일원화, 프론트 최적화
 */
@Builder
public record AlertInfoDto(
    Long id,
    String region,
    String message,
    boolean isRead,
    LocalDateTime createdAt
) {
    public static AlertInfoDto from(Alert alert) {
        return AlertInfoDto.builder()
            .id(alert.getId())
            .region(alert.getRegion())
            .message(alert.getMessage())
            .isRead(alert.isRead())
            .createdAt(alert.getCreatedAt())
            .build();
    }
}
