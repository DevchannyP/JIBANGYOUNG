package com.jibangyoung.domain.mypage.dto;

import com.jibangyoung.domain.mypage.entity.SurveyFavorite;
import lombok.Builder;

import java.time.format.DateTimeFormatter;

@Builder
public record SurveyFavoriteDto(
    Long id,
    String title,
    Boolean isFavorite,
    String participatedAt
) {
    public static SurveyFavoriteDto from(SurveyFavorite e) {
        return SurveyFavoriteDto.builder()
            .id(e.getId())
            .title(e.getTitle())
            .isFavorite(e.isFavorite())
            .participatedAt(e.getParticipatedAt() != null ? e.getParticipatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
            .build();
    }
}
