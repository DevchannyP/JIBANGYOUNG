package com.jibangyoung.domain.recommendation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.recommendation.dto.RecommendationResultDto;
import com.jibangyoung.domain.recommendation.service.RecommendationAlgorithmService;
import com.jibangyoung.domain.recommendation.service.RecommendationService;
import com.jibangyoung.global.security.CustomUserPrincipal;

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
            @AuthenticationPrincipal CustomUserPrincipal principal, // 인증 사용자 정보
            @PathVariable Long userId,
            @PathVariable Long responseId) {

        // 요청 userId와 토큰 userId 일치 여부 검증 (권장)
        if (!principal.getId().equals(userId)) {
            return ResponseEntity.status(403).build(); // 권한 없음
        }

        recommendationService.generateRecommendations(userId, responseId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // 추천 결과 조회 (새로고침 시에도 안전)
    @GetMapping("/{userId}/{responseId}")
    public ResponseEntity<List<RecommendationResultDto>> getRecommendations(
            @AuthenticationPrincipal CustomUserPrincipal principal, // 인증 사용자 정보
            @PathVariable Long userId,
            @PathVariable Long responseId) {

        // 요청 userId와 토큰 userId 일치 여부 검증 (권장)
        if (!principal.getId().equals(userId)) {
            return ResponseEntity.status(403).build(); // 권한 없음
        }

        List<RecommendationResultDto> result = recommendationResultService.getRankedRecommendationsGroupedByRankGroup(
                userId,
                responseId);
        return ResponseEntity.ok(result);
    }
}
