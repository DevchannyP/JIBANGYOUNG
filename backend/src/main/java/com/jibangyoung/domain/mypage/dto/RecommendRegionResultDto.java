package com.jibangyoung.domain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// dto/RecommendRegionResultDto.java
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendRegionResultDto {
    private String regionName;
    private double score;
    private String reason;
}