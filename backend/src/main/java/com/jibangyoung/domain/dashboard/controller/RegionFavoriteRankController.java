// com/jibangyoung/domain/dashboard/controller/RegionFavoriteRankController.java
package com.jibangyoung.domain.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.dashboard.dto.RegionFavoriteRankDto;
import com.jibangyoung.domain.dashboard.service.RegionFavoriteRankService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Dashboard", description = "정책 찜 수 기준 인기 지역 TOP 10 API")
@RestController
@RequestMapping("/api/dashboard/region")
@RequiredArgsConstructor
public class RegionFavoriteRankController {

    private final RegionFavoriteRankService service;

    @Operation(summary = "정책 찜 수 기준 인기 지역 TOP 10 조회 (Redis 캐시)")
    @GetMapping("/top10")
    public ResponseEntity<List<RegionFavoriteRankDto>> getTop10RegionFavorites() {
        // 🚨 null 리턴 불가: service에서 이미 빈 리스트 보장!
        List<RegionFavoriteRankDto> ranks = service.getTop10FromCache();
        return ResponseEntity.ok(ranks);
    }
}
