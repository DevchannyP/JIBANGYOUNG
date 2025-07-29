package com.jibangyoung.domain.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 내 모든 지역별 점수 DTO
 */
@Schema(description = "내 지역별 점수")
public record MyRegionScoreDto(
        @Schema(description = "지역 ID") int regionId,
        @Schema(description = "누적 점수") int score) {
}
