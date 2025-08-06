package com.jibangyoung.domain.policy.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.policy.service.RecommendedListService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class RecommendedListController {

    private final RecommendedListService recommendedListService;

    // userId를 쿼리 파라미터로 받아 추천 정책 리스트 반환
    @GetMapping("/recList")
    public List<PolicyCardDto> getRecommendedPolicies(@RequestParam String userId) {
        // userId를 이용해 추천 정책 리스트를 가져옴
        return recommendedListService.getRecommendedPoliciesByUserId(userId);
    }
}