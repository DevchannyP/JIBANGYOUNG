package com.jibangyoung.domain.mypage.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record RegionScoreDto(
        Long regionId,
        String regionName,
        int postCount,
        int commentCount,
        int mentoringCount,
        int score,
        float promotionProgress,
        int daysToMentor,
        List<ScoreHistoryDto> scoreHistory) {
    @Builder
    public record ScoreHistoryDto(String date, int delta, String reason) {
    }
}
