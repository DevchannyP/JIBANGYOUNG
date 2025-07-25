package com.jibangyoung.domain.mypage.controller;


import com.jibangyoung.domain.mypage.service.SurveyFavoriteService;
import com.jibangyoung.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "마이페이지-설문즐겨찾기", description = "설문 즐겨찾기 목록/토글 API")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class SurveyFavoriteController {

    private final SurveyFavoriteService surveyFavoriteService;

    @Operation(summary = "즐겨찾기 설문 페이징/정렬")
    @GetMapping("/surveys/favorites")
    public ApiResponse<Map<String, Object>> getSurveyFavorites(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "recent") String sort
    ) {
        Long userId = Long.parseLong(user.getUsername());
        return ApiResponse.success(surveyFavoriteService.getFavorites(userId, page, size, sort));
    }

    @Operation(summary = "즐겨찾기 토글(on/off)")
    @PostMapping("/surveys/favorites/{favoriteId}/toggle")
    public ApiResponse<Void> toggleSurveyFavorite(
            @PathVariable Long favoriteId,
            @AuthenticationPrincipal UserDetails user
    ) {
        Long userId = Long.parseLong(user.getUsername());
        surveyFavoriteService.toggleFavorite(favoriteId, userId);
        return ApiResponse.success(null);
    }
}
