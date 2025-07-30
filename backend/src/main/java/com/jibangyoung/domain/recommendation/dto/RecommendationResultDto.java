package com.jibangyoung.domain.recommendation.dto;

import java.util.List;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecommendationResultDto {
    private int no;
    private Integer rank; // 순위
    private Integer regionCode; // recommendation 테이블에서 조회
    private String regionName; // RegionRepository에서 조회
    private List<String> regionDescription; // infta_data 테이블에서 등급 조회
    private List<PolicyCardDto> policies; // 추천된 정책 4개
}