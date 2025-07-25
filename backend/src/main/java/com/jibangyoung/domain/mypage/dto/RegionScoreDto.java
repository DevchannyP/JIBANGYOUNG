package com.jibangyoung.domain.mypage.dto;

import com.jibangyoung.domain.mypage.entity.RegionScore;
import lombok.Builder;

import java.util.List;
import java.util.stream.Collectors;

@Builder
public record RegionScoreDto(
    String region,
    int postCount,
    int commentCount,
    int mentoringCount,
    int score,
    float promotionProgress,
    int daysToMentor,
    List<ScoreHistoryDto> scoreHistory
) {
    public static RegionScoreDto from(RegionScore entity) {
        return RegionScoreDto.builder()
            .region(entity.getRegion())
            .postCount(entity.getPostCount())
            .commentCount(entity.getCommentCount())
            .mentoringCount(entity.getMentoringCount())
            .score(entity.getScore())
            .promotionProgress(entity.getPromotionProgress())
            .daysToMentor(entity.getDaysToMentor())
            .scoreHistory(entity.getScoreHistory() == null ? List.of() :
                entity.getScoreHistory().stream().map(ScoreHistoryDto::from).collect(Collectors.toList()))
            .build();
    }

    @Builder
    public record ScoreHistoryDto(
        String date,
        int delta,
        String reason
    ) {
        public static ScoreHistoryDto from(com.jibangyoung.domain.mypage.entity.RegionScoreHistory h) {
            return ScoreHistoryDto.builder()
                .date(h.getDate().toString())
                .delta(h.getDelta())
                .reason(h.getReason())
                .build();
        }
    }
}
