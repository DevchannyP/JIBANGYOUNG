package com.jibangyoung.domain.recommendation.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.policy.repository.RegionRepository;
import com.jibangyoung.domain.policy.service.PolicyService;
import com.jibangyoung.domain.recommendation.dto.RecommendationRegionReasonDto;
import com.jibangyoung.domain.recommendation.entity.Recommendation;
import com.jibangyoung.domain.recommendation.repository.RecommendationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationDetailService {

    private final RecommendationRepository recommendationRepository;
    private final RegionRepository regionRepository;
    private final PolicyService policyService;

    /**
     * 추천 지역 전체 정책 리스트 반환
     */
    public List<PolicyCardDto> getAllPoliciesByUserResponseAndRegion(Long userId, Long responseId, String regionCode) {
        // 1. 해당 regionCode에 속한 rankGroup 찾기
        List<Recommendation> recommendations = recommendationRepository.findByUserIdAndResponseId(userId, responseId);

        // 해당 regionCode 포함된 rankGroup 찾기 (rankGroup은 Integer, regionCode는 String)
        Optional<Integer> rankGroupOpt = recommendations.stream()
                .filter(r -> regionCode.equals(r.getRegionCode()))
                .map(Recommendation::getRankGroup)
                .findFirst();

        if (rankGroupOpt.isEmpty()) {
            return List.of();
        }
        int rankGroup = rankGroupOpt.get();

        // 2. rankGroup에 속한 모든 추천 정책 추출
        List<Recommendation> recsInGroup = recommendations.stream()
                .filter(r -> r.getRankGroup() == rankGroup)
                .collect(Collectors.toList());

        // 3. 정책코드 리스트
        List<Integer> policyCodes = recsInGroup.stream()
                .map(Recommendation::getPolicyCode)
                .distinct()
                .collect(Collectors.toList());

        // 4. 정책 상세 정보 조회
        List<PolicyCardDto> policies = policyService.getPoliciesByCodes(policyCodes);

        // 5. rank 기준 정렬
        Map<Integer, Integer> policyRankMap = recsInGroup.stream()
                .collect(Collectors.toMap(
                        Recommendation::getPolicyCode,
                        Recommendation::getRank,
                        Math::min));
        policies.sort(Comparator.comparingInt(p -> policyRankMap.getOrDefault(p.getNO(), Integer.MAX_VALUE)));

        return policies;
    }

    /**
     * 추천 지역 사유 반환
     */
    public RecommendationRegionReasonDto getRegionReason(Long userId, Long responseId, String regionCode) {
        // 1. infraData 조회 (예: RecommendationRepository에서 getDescriptionByGrade 활용)
        List<Object[]> infraRows = recommendationRepository.getDescriptionByGrade(regionCode);

        String[] grades = new String[] { "정보없음", "정보없음", "정보없음", "정보없음" };
        if (infraRows != null && !infraRows.isEmpty()) {
            Object[] gradeRow = infraRows.get(0);
            for (int i = 0; i < 4; i++) {
                grades[i] = (gradeRow[i] != null) ? gradeRow[i].toString() : "정보없음";
            }
        }

        // 2. 지역명 조회
        Integer regionCodeInt;
        try {
            regionCodeInt = Integer.parseInt(regionCode);
        } catch (NumberFormatException e) {
            regionCodeInt = 99999;
        }

        String regionName = regionCodeInt == 99999
                ? "전국"
                : regionRepository.findById(regionCodeInt)
                        .map(region -> {
                            StringBuilder sb = new StringBuilder(region.getSido());
                            if (region.getGuGun1() != null && !region.getGuGun1().isEmpty()) {
                                sb.append(" ").append(region.getGuGun1());
                            }
                            if (region.getGuGun2() != null && !region.getGuGun2().isEmpty()) {
                                sb.append(" ").append(region.getGuGun2());
                            }
                            return sb.toString();
                        }).orElse("미등록");

        // 3. 하드코딩된 사유 설명
        String reason1 = String.format("의료 인프라 등급 : %s : %s은(는) 의료기관 종별 인프라가 매우 %s 지역입니다",
                grades[0], regionName, mapMedicalInfraGradeWord(grades[0]));
        String reason2 = String.format("의료 접근성 등급 : %s : %s은(는) 의료기관 접근성이 %s 지역입니다",
                grades[1], regionName, mapAccessibilityGradeWord(grades[1]));
        String reason3 = String.format("교통 인프라 등급 : %s : %s은(는) 교통 인프라가 %s 지역입니다",
                grades[2], regionName, mapTransportInfraGradeWord(grades[2]));
        String reason4 = String.format("주거 인프라 등급 : %s : %s은(는) 주거비가 %s 지역입니다",
                grades[3], regionName, mapHousingGradeWord(grades[3]));

        // 4. rankGroup 찾기
        Optional<Integer> rankGroupOpt = recommendationRepository.findByUserIdAndResponseId(userId, responseId).stream()
                .filter(r -> regionCode.equals(r.getRegionCode()))
                .map(Recommendation::getRankGroup)
                .findFirst();

        int rankGroup = rankGroupOpt.orElse(-1);

        return new RecommendationRegionReasonDto(rankGroup, regionName, reason1, reason2, reason3, reason4);
    }

    // 하드코딩된 등급 단어 매핑 (예시)
    private String mapMedicalInfraGradeWord(String grade) {
        return switch (grade) {
            case "A" -> "높은";
            case "B" -> "우수한";
            case "C" -> "평균인";
            case "D" -> "부족한";
            default -> "정보가 부족한";
        };
    }

    private String mapAccessibilityGradeWord(String grade) {
        return switch (grade) {
            case "A" -> "매우 좋은";
            case "B" -> "좋은";
            case "C" -> "보통인";
            case "D" -> "떨어지는";
            default -> "정보가 부족한";
        };
    }

    private String mapTransportInfraGradeWord(String grade) {
        return switch (grade) {
            case "A" -> "매우 뛰어난";
            case "B" -> "우수한";
            case "C" -> "평균인";
            case "D" -> "부족한";
            default -> "정보가 부족한";
        };
    }

    private String mapHousingGradeWord(String grade) {
        return switch (grade) {
            case "A" -> "매우 적당한";
            case "B" -> "적당한";
            case "C" -> "다소 높은";
            case "D" -> "높은";
            default -> "정보가 부족한";
        };
    }
}
