package com.jibangyoung.domain.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PolicyScoreDto {
    private Integer policyCode; // 정책 코드
    private String regionCode; // 지역코드
    private Integer minAge; // 최소나이
    private Integer maxAge; // 최대 나이
    private String schoolCode; // 정책학력코드
    private String bizCode; // 정책특화코드
    private String mrgCode; // 정책결혼코드
    private String jobCode; // 정책취업코드
    private String bigCategoryNm; // 정책대분류명
    private String midCategoryNm; // 정책중분류명
    private double poliscore; // 정책점수
}