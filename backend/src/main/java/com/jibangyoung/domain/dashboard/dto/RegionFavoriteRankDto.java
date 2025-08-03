package com.jibangyoung.domain.dashboard.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * [DTO] 정책 찜 수 기준 인기 지역 Projection
 * - DB Projection → API 응답용
 */
@Data
@AllArgsConstructor
public class RegionFavoriteRankDto {
    @Schema(description = "지역 코드")
    private Integer regionCode;

    @Schema(description = "시도명")
    private String sido;

    @Schema(description = "구/군1")
    private String guGun1;

    @Schema(description = "구/군2")
    private String guGun2;

    @Schema(description = "정책 찜 수")
    private Long favoriteCount;
}
