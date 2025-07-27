package com.jibangyoung.domain.mypage.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.service.RegionScoreService;
import com.jibangyoung.global.common.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class RegionScoreController {

    private final RegionScoreService regionScoreService;

    @GetMapping("/region-score/{regionId}")
    public ApiResponse<RegionScoreDto> getRegionScore(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long regionId) {
        return ApiResponse.success(regionScoreService.getRegionScore(userId, regionId));
    }
}
