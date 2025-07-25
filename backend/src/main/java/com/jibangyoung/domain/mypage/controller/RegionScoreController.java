package com.jibangyoung.domain.mypage.controller;

import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.service.RegionScoreService;
import com.jibangyoung.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "마이페이지 - 지역 점수", description = "지역별 점수/진행률 API")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class RegionScoreController {

    private final RegionScoreService regionScoreService;

    @Operation(summary = "지역별 점수/진행률/이력 조회")
    @GetMapping("/region-scores/{region}")
    public ApiResponse<RegionScoreDto> getRegionScore(@PathVariable String region) {
        return ApiResponse.success(regionScoreService.getRegionScore(region));
    }
}
