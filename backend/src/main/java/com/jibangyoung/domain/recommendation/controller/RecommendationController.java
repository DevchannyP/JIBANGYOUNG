package com.jibangyoung.domain.recommendation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.recommendation.entity.Recommendation;
import com.jibangyoung.domain.recommendation.service.RecommendationAlgorithmService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationAlgorithmService recommendationService;

    @PostMapping("/{userId}/{responseId}")
    public List<Recommendation> createRecommendations(@PathVariable Long userId,
            @PathVariable Long responseId) {
        return recommendationService.generateRecommendations(userId, responseId);
    }

    // @GetMapping("/{userId}/{responseId}")
    // public List<Recommendation> getRecommendations(@PathVariable Long userId,
    // @PathVariable Long responseId) {
    // // 추천 결과 조회
    // List<Recommendation> recommendations =
    // recommendationService.getRecommendations(userId, responseId);

    // // 조회 후 is_viewed = true로 업데이트
    // recommendationService.markAsViewed(userId, responseId);

    // return recommendations;
    // }
}