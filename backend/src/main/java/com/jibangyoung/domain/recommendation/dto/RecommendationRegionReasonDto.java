package com.jibangyoung.domain.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecommendationRegionReasonDto {
    private Integer rankGroup;
    private String regionName;
    private String reason1; // 의료 인프라 사유
    private String reason2; // 의료 접근성 사유
    private String reason3; // 교통 인프라 사유
    private String reason4; // 주거 인프라 사유
}