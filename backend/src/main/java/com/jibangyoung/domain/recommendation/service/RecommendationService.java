package com.jibangyoung.domain.recommendation.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    // 1) 사용자, 응답별 추천 데이터를 지역별로 그룹화
    public Map<String, List<Recommendation>> getRecommendationsGroupedByRegion(Long userId, Long responseId) {
        List<Recommendation> recommendations = recommendationRepository.findByUserIdAndResponseId(userId, responseId);
        return recommendations.stream()
                .collect(Collectors.groupingBy(Recommendation::getRegionCode));
    }

    // 2) 그룹화된 데이터를 기반으로 DTO 리스트 생성, 랭킹 부여
    public List<RecommendationResultDto> getRankedRecommendationsGroupedByRegion(Long userId, Long responseId) {
        Map<String, List<Recommendation>> groupedByRegion = getRecommendationsGroupedByRegion(userId, responseId);
        List<RecommendationResultDto> result = new ArrayList<>();

        // 랭킹은 정렬 기준 필요하면 수정 가능 (여기서는 임의 순서)
        int rankCounter = 1;

        for (Map.Entry<String, List<Recommendation>> entry : groupedByRegion.entrySet()) {
            String regionCodeStr = entry.getKey();
            List<Recommendation> recs = entry.getValue();

            Integer regionCodeInt;
            try {
                regionCodeInt = Integer.valueOf(regionCodeStr.trim());
            } catch (NumberFormatException e) {
                continue; // 지역코드 파싱 실패 시 스킵
            }

            // 지역명 조회 및 조합
            String regionName = regionRepository.findById(regionCodeInt)
                    .map(this::buildFullRegionName)
                    .orElse("미등록");

            // InfraData에서 4개 등급 컬럼 조회
            // getDescriptionByGrade()는 List<Object[]> 반환 예상 (Object[]{medical,
            // accessibility, transport, housing})
            List<Object[]> infraRows = recommendationRepository.getDescriptionByGrade(regionCodeInt);

            String[] regionGrades;
            if (infraRows != null && !infraRows.isEmpty()) {
                Object[] grades = infraRows.get(0);
                regionGrades = new String[4];
                for (int i = 0; i < 4; i++) {
                    regionGrades[i] = (grades[i] != null) ? grades[i].toString() : null;
                }
            } else {
                regionGrades = new String[] { null, null, null, null };
            }

            // 등급 코드 배열을 설명 메시지 리스트로 변환
            List<String> regionDescription = getDescriptionByGrade(List.of(regionGrades));

            // 추천 정책 최대 4개
            List<PolicyCardDto> regionPolicies = policyService.getPoliciesByRegion(regionCodeInt)
                    .stream()
                    .limit(4)
                    .collect(Collectors.toList());

            // no: 해당 지역 추천 리스트 중 첫 Recommendation PK
            Long no = recs.isEmpty() ? null : recs.get(0).getId();
            int noValue = (no != null) ? no.intValue() : rankCounter;

            RecommendationResultDto dto = new RecommendationResultDto(
                    noValue,
                    rankCounter,
                    regionCodeInt,
                    regionName,
                    regionDescription,
                    regionPolicies);

            result.add(dto);
            rankCounter++;
        }

        return result;
    }

    private String buildFullRegionName(Region region) {
        StringBuilder sb = new StringBuilder(region.getSido());
        if (region.getGuGun1() != null && !region.getGuGun1().isEmpty()) {
            sb.append(" ").append(region.getGuGun1());
        }
        if (region.getGuGun2() != null && !region.getGuGun2().isEmpty()) {
            sb.append(" ").append(region.getGuGun2());
        }
        return sb.toString();
    }

    public List<String> getDescriptionByGrade(List<String> regionGrades) {
        List<String> descriptions = new ArrayList<>();

        if (regionGrades == null || regionGrades.size() < 4) {
            return List.of("인프라 정보가 부족해요");
        }

        descriptions.add(mapMedicalInfra(regionGrades.get(0)));
        descriptions.add(mapAccessibility(regionGrades.get(1)));
        descriptions.add(mapTransportInfra(regionGrades.get(2)));
        descriptions.add(mapHousing(regionGrades.get(3)));

        return descriptions;
    }

    private String mapMedicalInfra(String grade) {
        return switch (grade) {
            case "A" -> "의료 인프라가 매우 뛰어난 지역이에요";
            case "B" -> "의료 인프라가 우수한 지역이에요";
            case "C" -> "의료 인프라가 평균인 지역이에요";
            case "D" -> "의료 인프라가 부족한 지역이에요";
            default -> "의료 인프라 정보가 부족해요";
        };
    }

    private String mapAccessibility(String grade) {
        return switch (grade) {
            case "A" -> "의료 접근성이 매우 좋은 지역이에요";
            case "B" -> "의료 접근성이 좋은 지역이에요";
            case "C" -> "의료 접근성이 보통인 지역이에요";
            case "D" -> "의료 접근성이 떨어지는 지역이에요";
            default -> "접근성 정보가 부족해요";
        };
    }

    private String mapTransportInfra(String grade) {
        return switch (grade) {
            case "A" -> "교통 인프라가 매우 뛰어난 지역이에요";
            case "B" -> "교통 인프라가 우수한 지역이에요";
            case "C" -> "교통 인프라가 평균인 지역이에요";
            case "D" -> "교통 인프라가 부족한 지역이에요";
            default -> "교통 인프라 정보가 부족해요";
        };
    }

    private String mapHousing(String grade) {
        return switch (grade) {
            case "A" -> "주거비가 매우 적당한 지역이에요";
            case "B" -> "주거비가 적당한 지역이에요";
            case "C" -> "주거비가 다소 높은 지역이에요";
            case "D" -> "주거비가 높은 지역이에요";
            default -> "주거비 정보가 부족해요";
        };
    }

}
