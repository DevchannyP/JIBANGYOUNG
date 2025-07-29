// controller/SurveyResponseController.java
package com.jibangyoung.domain.mypage.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.RecommendRegionResultDto;
import com.jibangyoung.domain.mypage.dto.SurveyAnswerDto;
import com.jibangyoung.domain.mypage.dto.SurveyResponseGroupsResponse;
import com.jibangyoung.domain.mypage.service.SurveyResponseService;
import com.jibangyoung.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "마이페이지-설문응답", description = "마이페이지 설문 응답(묶음/상세/추천) API")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class SurveyResponseController {
    private final SurveyResponseService surveyResponseService;

    @Operation(summary = "설문 응답 묶음(그룹) 페이징 조회")
    @GetMapping("/survey-response-groups")
    public ApiResponse<SurveyResponseGroupsResponse> getSurveyResponseGroups(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(surveyResponseService.getSurveyResponseGroups(userId, page, size));
    }

    @Operation(summary = "설문 묶음 상세(문항별) 조회")
    @GetMapping("/survey-responses/{responseId}/answers")
    public ApiResponse<List<SurveyAnswerDto>> getSurveyAnswers(
            @PathVariable Long responseId) {
        return ApiResponse.success(surveyResponseService.getSurveyAnswersByResponseId(responseId));
    }

    @Operation(summary = "추천지역 산출")
    @GetMapping("/survey-responses/{responseId}/recommend-region")
    public ApiResponse<RecommendRegionResultDto> getRecommendRegion(
            @PathVariable Long responseId) {
        return ApiResponse.success(surveyResponseService.recommendRegion(responseId));
    }
}
