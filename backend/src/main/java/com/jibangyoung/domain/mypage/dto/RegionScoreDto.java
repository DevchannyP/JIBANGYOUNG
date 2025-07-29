// com.jibangyoung.domain.mypage.dto.RegionScoreDto.java
package com.jibangyoung.domain.mypage.dto;

import java.util.List;

public record RegionScoreDto(
        int regionId,
        String regionName,
        int postCount,
        int commentCount,
        int mentoringCount,
        int score,
        double promotionProgress,
        int daysToMentor,
        List<RegionScoreDto.ScoreHistoryItem> scoreHistory) {
    public record ScoreHistoryItem(
            String date,
            int delta,
            String reason) {
    }
}
