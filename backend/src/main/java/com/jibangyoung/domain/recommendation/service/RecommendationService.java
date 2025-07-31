package com.jibangyoung.domain.recommendation.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    public List<RecommendationResultDto> getRankedRecommendationsGroupedByRankGroup(Long userId, Long responseId) {
        Map<Integer, List<Recommendation>> groupedByRankGroup = getRecommendationsGroupedByRankGroup(userId,
                responseId);
        List<RecommendationResultDto> result = new ArrayList<>();

        groupedByRankGroup.keySet().stream().sorted().forEach(rankGroup -> {
            List<Recommendation> recs = groupedByRankGroup.get(rankGroup);

            // 지역 정책 중 rank 기준 가장 높은 하나만 선택
            Optional<Recommendation> selectedRegionRecOpt = recs.stream()
                    .filter(r -> !"99999".equals(r.getRegionCode()))
                    .sorted(Comparator.comparingInt(Recommendation::getRank))
                    .findFirst();

            if (selectedRegionRecOpt.isEmpty())
                return;

            // 추천 지역명 추출
            Recommendation selectedRegionRec = selectedRegionRecOpt.get();
            String regionCodeStr = selectedRegionRec.getRegionCode();
            Integer regionCodeInt;
            try {
                regionCodeInt = Integer.parseInt(regionCodeStr);
            } catch (NumberFormatException e) {
                regionCodeInt = 99999;
            }

            String regionName = regionCodeInt == 99999
                    ? "전국"
                    : regionRepository.findById(regionCodeInt)
                            .map(this::buildFullRegionName)
                            .orElse("미등록");

            // 테스트용
            System.out.println(regionCodeStr + " : 지역 코드");

            List<Object[]> infraRows = (regionCodeInt == 99999) ? null
                    : recommendationRepository.getDescriptionByGrade(regionCodeStr);

            String[] regionGrades = new String[] { "정보없음", "정보없음", "정보없음", "정보없음" };
            if (infraRows != null && !infraRows.isEmpty()) {
                Object[] grades = infraRows.get(0);
                for (int i = 0; i < 4; i++) {
                    regionGrades[i] = (grades[i] != null) ? grades[i].toString() : "정보없음";
                }
            }

            List<String> regionDescription = getDescriptionByGrade(List.of(regionGrades));

            // 해당 그룹의 전체 정책코드 모으기 (지역 + 전국)
            List<Integer> groupPolicyCodesInt = recs.stream()
                    .map(r -> r.getPolicyCode()) // 이미 Integer 타입이면 String 변환 불필요
                    .distinct()
                    .collect(Collectors.toList());

            // 여기서 groupPolicyCodes 출력(테스트용)
            System.out.println("[DEBUG] RankGroup: " + rankGroup + ", policyCodes: " + groupPolicyCodesInt);

            // 해당 코드로 정책 조회 후 rank 기준 정렬, 상위 4개
            Map<Integer, Integer> policyCodeToRankMap = recs.stream()
                    .collect(Collectors.toMap(
                            r -> r.getPolicyCode(),
                            Recommendation::getRank,
                            Math::min)); // 동일 정책코드일 경우 더 낮은 rank 사용

            List<PolicyCardDto> sortedTop4 = policyService.getPoliciesByCodes(groupPolicyCodesInt).stream()
                    .sorted(Comparator.comparingInt(p -> policyCodeToRankMap.getOrDefault(
                            p.getNO(), Integer.MAX_VALUE)))
                    .limit(4)
                    .collect(Collectors.toList());

            result.add(new RecommendationResultDto(
                    selectedRegionRec.getId().intValue(),
                    rankGroup,
                    selectedRegionRec.getRank(),
                    regionCodeInt,
                    regionName,
                    regionDescription,
                    sortedTop4));
        });

        return result;
    }

    public Map<Integer, List<Recommendation>> getRecommendationsGroupedByRankGroup(Long userId, Long responseId) {
        List<Recommendation> recommendations = recommendationRepository.findByUserIdAndResponseId(userId, responseId);
        return recommendations.stream().collect(Collectors.groupingBy(Recommendation::getRankGroup));
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
        if (regionGrades == null || regionGrades.size() < 4) {
            return List.of("인프라 정보가 부족해요");
        }

        List<String> descriptions = new ArrayList<>();
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
