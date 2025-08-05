package com.jibangyoung.domain.policy.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.recommendation.entity.Recommendation;
import com.jibangyoung.domain.recommendation.repository.RecommendationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendedListService {

    private final RecommendationRepository recommendationRepository;
    private final PolicyService policyService;

    public List<PolicyCardDto> getRecommendedPoliciesByUserId(String userId) {
        // 1. userId에 해당하는 plcyNo 목록 추출 (중복 제거)
        // 테스트용 하드코딩
        Long userIdLong = 1001L;
        // Integer userIdInt = Integer.parseInt(userId);
        List<Integer> policyCodes = recommendationRepository.findByUserId(userIdLong).stream()
                .map(Recommendation::getPolicyCode)
                .distinct()
                .toList();
        if (policyCodes.isEmpty()) {
            return List.of();
        }

        // 2. 정책들 필터링 및 DTO 변환 (주신 로직 활용)
        List<PolicyCardDto> recList = policyService.getPoliciesByCodes(policyCodes);
        return recList;
    }
}
