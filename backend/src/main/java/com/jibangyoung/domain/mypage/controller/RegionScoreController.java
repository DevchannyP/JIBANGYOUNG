package com.jibangyoung.domain.mypage.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.ActivityEventDto;
import com.jibangyoung.domain.mypage.dto.MyRegionScoreDto;
import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.service.ScoreService;
import com.jibangyoung.global.common.ApiResponse;
import com.jibangyoung.global.security.CustomUserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Region Score", description = "지역별 사용자 점수/랭킹 API")
@RestController
@RequestMapping("/api/mypage/region-score")
@RequiredArgsConstructor
public class RegionScoreController {

    private final ScoreService scoreService;

    @Operation(summary = "특정 지역의 단일 점수 요약", description = "regionId로 해당 지역의 내 점수 상세 조회")
    @GetMapping("/{regionId}")
    public ApiResponse<?> getRegionScore(@RequestParam Long userId, @PathVariable int regionId) {
        return ApiResponse.success(scoreService.getRegionScore(userId, regionId));
    }

    @Operation(summary = "지역별 TOP-N 랭킹", description = "특정 지역의 상위 점수 유저 목록 조회")
    @GetMapping("/ranking")
    public ApiResponse<List<RegionScoreDto>> getRegionRanking(
            @RequestParam int regionId,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(scoreService.getTopRankByRegion(regionId, size));
    }

    @Operation(summary = "내 지역별 점수", description = "JWT 인증을 통해 로그인한 사용자의 모든 지역 점수 반환")
    @GetMapping("/my")
    public ApiResponse<List<MyRegionScoreDto>> getMyRegionScores(
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId(); // ✅ JWT → SecurityContext → Principal ID 추출
        return ApiResponse.success(scoreService.getUserRegionScores(userId));
    }

    @Operation(summary = "사용자 행동 이벤트 기록", description = "점수 변동 이벤트 로깅 (비동기/배치 연동 가능)")
    @PostMapping("/activity")
    public ApiResponse<Void> recordActivity(@RequestBody ActivityEventDto dto) {
        scoreService.recordUserActivity(dto);
        return ApiResponse.success(null);
    }
}
