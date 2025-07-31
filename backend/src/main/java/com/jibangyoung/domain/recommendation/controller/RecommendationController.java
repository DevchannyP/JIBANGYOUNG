package com.jibangyoung.domain.recommendation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.recommendation.dto.RecommendationResultDto;
import com.jibangyoung.domain.recommendation.service.RecommendationAlgorithmService;
import com.jibangyoung.domain.recommendation.service.RecommendationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationAlgorithmService recommendationService;
    private final RecommendationService recommendationResultService;

    // 추천 생성 (설문 제출 시 최초 한 번만 실행)
    @PostMapping("/{userId}/{responseId}")
    public ResponseEntity<Void> createRecommendations(
            @PathVariable Long userId,
            @PathVariable Long responseId) {
        recommendationService.generateRecommendations(userId, responseId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // 추천 결과 조회 (새로고침 시에도 안전)
    @GetMapping("/{userId}/{responseId}")
    public ResponseEntity<List<RecommendationResultDto>> getRecommendations(
            @PathVariable Long userId,
            @PathVariable Long responseId) {
        List<RecommendationResultDto> result = recommendationResultService.getRankedRecommendationsGroupedByRankGroup(
                userId,
                responseId);
        return ResponseEntity.ok(result);
    }
}
