package com.jibangyoung.domain.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.dashboard.dto.ReviewPostDto;
import com.jibangyoung.domain.dashboard.service.ReviewDashboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ReviewDashboardController {

    private final ReviewDashboardService reviewDashboardService;

    /**
     * 인기 정착 후기 Top3 조회
     */
    @GetMapping("/review-top/top3")
    public ResponseEntity<List<ReviewPostDto>> getReviewTop3() {
        try {
            List<ReviewPostDto> result = reviewDashboardService.getReviewTop3();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("인기 정착 후기 Top3 조회 API 오류", e);
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
}