package com.jibangyoung.domain.recommendation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.recommendation.dto.RecommendationRegionReasonDto;
import com.jibangyoung.domain.recommendation.service.RecommendationDetailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendation")
public class RecommendationDetailController {

    private final RecommendationDetailService recommendationDetailService;

    // 정책 카드 목록 조회
    @GetMapping("/{userId}/{responseId}/{regionCode}/policy.c")
    public List<PolicyCardDto> getPolicies(
            @PathVariable Long userId,
            @PathVariable Long responseId,
            @PathVariable String regionCode) {
        return recommendationDetailService.getAllPoliciesByUserResponseAndRegion(userId, responseId, regionCode);
    }

    // 지역 추천 사유 조회
    @GetMapping("/{userId}/{responseId}/{regionCode}/reason")
    public RecommendationRegionReasonDto getReason(
            @PathVariable Long userId,
            @PathVariable Long responseId,
            @PathVariable String regionCode) {
        return recommendationDetailService.getRegionReason(userId, responseId, regionCode);
    }
}
