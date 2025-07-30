package com.jibangyoung.domain.recommendation.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.policy.entity.Region;
import com.jibangyoung.domain.policy.repository.RegionRepository;
import com.jibangyoung.domain.policy.service.PolicyService;
import com.jibangyoung.domain.recommendation.dto.RecommendationResultDto;
import com.jibangyoung.domain.recommendation.entity.Recommendation;
import com.jibangyoung.domain.recommendation.repository.RecommendationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final RegionRepository regionRepository;
    private final PolicyService policyService;

    // 사용자+응답ID 기준으로 추천 결과를 지역별로 그룹핑
    public Map<String, List<Recommendation>> getRecommendationsGroupedByRegion(Long userId, Long responseId) {
        // userId, responseId로 추천 목록 조회 (regionCode 기준 정렬 포함)
        List<Recommendation> recommendations = recommendationRepository
                .findByUserIdAndResponseIdOrderByRegionCode(userId, responseId);

        // regionCode(String)별로 그룹핑
        return recommendations.stream()
                .collect(Collectors.groupingBy(Recommendation::getRegionCode));
    }

    // 지역별 랭킹 부여 및 DTO 변환
    public List<RecommendationResultDto> getRankedRecommendationsGroupedByRegion(Long userId, Long responseId) {
        Map<String, List<Recommendation>> groupedByRegion = getRecommendationsGroupedByRegion(userId, responseId);

        List<RecommendationResultDto> result = new ArrayList<>();

        for (Map.Entry<String, List<Recommendation>> entry : groupedByRegion.entrySet()) {
            String regionCodeStr = entry.getKey();
            List<Recommendation> recs = entry.getValue();

            // 지역 코드 String -> Integer 변환
            Integer regionCodeInt = null;
            try {
                regionCodeInt = Integer.valueOf(regionCodeStr.trim());
            } catch (NumberFormatException e) {
                // 변환 실패 시 null 처리
            }

            // 지역명 조회 (Region 엔티티)
            String regionName = "미등록";
            if (regionCodeInt != null) {
                regionName = regionRepository.findById(regionCodeInt)
                        .map(this::buildFullRegionName)
                        .orElse("미등록");
            }

            // 추천 리스트에 rank 부여하며 DTO 변환
            int rank = 1;
            for (Recommendation rec : recs) {
                // 각 Recommendation 안에 policyCode 리스트가 있다고 가정
                List<PolicyCardDto> policies = rec.getPolicyCode().stream()
                        .map(policyCode -> policyService.getPolicyCardByPolicyCode(policyCode))
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());

                RecommendationResultDto dto = new RecommendationResultDto(
                        rank++,
                        regionCodeInt,
                        regionName,
                        rec.getRegionDescription(), // 인프라 등급 등
                        policies);

                result.add(dto);
            }
        }

        return result;
    }

    // region 엔티티 시도명 + 구군명1 + 구군명2 조합
    private String buildFullRegionName(Region region) {
        StringBuilder sb = new StringBuilder();
        sb.append(region.getSido());

        if (region.getGuGun1() != null && !region.getGuGun1().isEmpty()) {
            sb.append(" ").append(region.getGuGun1());
        }
        if (region.getGuGun2() != null && !region.getGuGun2().isEmpty()) {
            sb.append(" ").append(region.getGuGun2());
        }

        return sb.toString();
    }
}
