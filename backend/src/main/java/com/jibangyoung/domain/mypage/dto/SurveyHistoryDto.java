package com.jibangyoung.domain.mypage.dto;

import com.jibangyoung.domain.mypage.entity.SurveyHistory;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * DTO Projection for CSR response
 */
@Builder
public record SurveyHistoryDto(
    Long id,
    String title,
    LocalDateTime participatedAt,
    String resultUrl,
    boolean isFavorite
) {
    public static SurveyHistoryDto from(SurveyHistory entity) {
        return SurveyHistoryDto.builder()
            .id(entity.getId())
            .title(entity.getTitle())
            .participatedAt(entity.getParticipatedAt())
            .resultUrl(entity.getResultUrl())
            .isFavorite(entity.isFavorite())
            .build();
    }
}
