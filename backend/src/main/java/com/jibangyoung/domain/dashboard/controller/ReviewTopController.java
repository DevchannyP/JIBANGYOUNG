// domain/dashboard/controller/ReviewTopController.java
package com.jibangyoung.domain.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.dashboard.dto.ReviewPostDto;
import com.jibangyoung.domain.dashboard.service.ReviewTopService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "ReviewTop", description = "인기 정착 후기 Top3 API")
@RestController
@RequestMapping("/api/dashboard/monthly-hot")
@RequiredArgsConstructor
public class ReviewTopController {

    private final ReviewTopService reviewTopService;

    @Operation(summary = "인기 정착 후기 Top3 (캐싱 기반, 빠른 응답)")
    @GetMapping("/review-top3")
    public ResponseEntity<List<ReviewPostDto>> getReviewTop3() {
        List<ReviewPostDto> list = reviewTopService.getTop3Reviews();
        return ResponseEntity.ok(list);
    }
}
