package com.jibangyoung.domain.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecommendedRegionDto {
    private String regionCode; // 지역 코드
    private String infra_medi_1; // 의료인프라등급
    private String infra_medi_2; // 의료접근성등급
    private String infra_traf; // 교통인프라등급
    private String infra_regi; // 주거인프라등급
    private double totInfraScore; // 최종 인프라 점수
}
