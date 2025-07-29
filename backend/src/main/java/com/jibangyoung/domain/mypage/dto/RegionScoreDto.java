package com.jibangyoung.domain.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 지역별 랭킹/점수 DTO (Projection 최적화)
 */
@Schema(description = "지역별 유저 점수 정보")
public record RegionScoreDto(
        @Schema(description = "유저 ID") Long userId,
        @Schema(description = "점수") int score) {
}
