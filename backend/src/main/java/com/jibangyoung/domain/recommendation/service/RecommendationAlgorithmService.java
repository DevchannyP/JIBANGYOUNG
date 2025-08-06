package com.jibangyoung.domain.recommendation.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.recommendation.dto.PolicyScoreDto;
import com.jibangyoung.domain.recommendation.dto.RecommendedRegionDto;
import com.jibangyoung.domain.recommendation.entity.Recommendation;
import com.jibangyoung.domain.recommendation.repository.RecommendationRepository;
import com.jibangyoung.domain.survey.entity.SurveyAnswer;
import com.jibangyoung.domain.survey.repository.SurveyAnswerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationAlgorithmService {

    private final RecommendationRepository recommendationRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;

    @Transactional
    public List<Recommendation> generateRecommendations(Long userId, Long responseId) {
        Map<String, String> answers = loadSurveyAnswers(userId, responseId);
        List<PolicyScoreDto> scoredPolicies = filterAndScorePolicies(answers);
        List<String> topRegions = determineTopRegions(answers);

        Map<String, List<PolicyScoreDto>> topPoliciesByRegion = new HashMap<>();

        List<PolicyScoreDto> nationwidePolicies = scoredPolicies.stream()
                .filter(p -> "99999".equals(p.getRegionCode()))
                .sorted(Comparator.comparingDouble(PolicyScoreDto::getPoliscore).reversed())
                .collect(Collectors.toList());

        int rank = 1;
        Map<String, Integer> regionRankMap = new HashMap<>();
        for (String region : topRegions) {
            List<PolicyScoreDto> regionPolicies = scoredPolicies.stream()
                    .filter(p -> region.equals(p.getRegionCode()))
                    .collect(Collectors.toList());

            List<PolicyScoreDto> combinedPolicies = new ArrayList<>();
            combinedPolicies.addAll(regionPolicies);

            // 전국 정책은 regionCode를 바꾸지 않고 rankGroup만 같게 처리
            for (PolicyScoreDto nationwidePolicy : nationwidePolicies) {
                combinedPolicies.add(nationwidePolicy);
            }

            combinedPolicies.sort(Comparator.comparingDouble(PolicyScoreDto::getPoliscore).reversed());
            topPoliciesByRegion.put(region, combinedPolicies);
            regionRankMap.put(region, rank);
            rank++;
        }

        List<Recommendation> recommendations = new ArrayList<>();
        for (Map.Entry<String, List<PolicyScoreDto>> entry : topPoliciesByRegion.entrySet()) {
            String region = entry.getKey();
            int regionRank = regionRankMap.get(region);

            List<PolicyScoreDto> policies = entry.getValue();

            int innerRank = 1;
            for (PolicyScoreDto policy : policies) {
                recommendations.add(Recommendation.builder()
                        .userId(userId)
                        .responseId(responseId)
                        .regionCode(policy.getRegionCode()) // 원래 regionCode 유지
                        .policyCode(policy.getPolicyCode())
                        .rankGroup(regionRank) // 그룹 번호
                        .rank(innerRank) // 그룹 내 정책 순위
                        .build());
                innerRank++;
            }
        }

        return recommendationRepository.saveAll(recommendations);
    }

    private Map<String, String> loadSurveyAnswers(Long userId, Long responseId) {
        List<SurveyAnswer> answers = surveyAnswerRepository.findByUserIdAndResponseId(userId, responseId);
        return answers.stream()
                .collect(Collectors.toMap(
                        SurveyAnswer::getQuestionId,
                        SurveyAnswer::getOptionCode,
                        (existing, replacement) -> existing + "," + replacement));
    }

    private List<PolicyScoreDto> filterAndScorePolicies(Map<String, String> answers) {
        List<PolicyScoreDto> allPolicies = loadAllPolicies();

        List<PolicyScoreDto> filtered = allPolicies.stream()
                .filter(p -> isPolicyEligible(p, answers))
                .toList();

        return filtered.stream()
                .peek(p -> p.setPoliscore(calculateScore(p, answers)))
                .toList();
    }

    private boolean isPolicyEligible(PolicyScoreDto policy, Map<String, String> answers) {
        int userAge = Integer.parseInt(answers.getOrDefault("Q1", "0"));
        if (policy.getMinAge() > 0 && userAge < policy.getMinAge())
            return false;
        if (policy.getMaxAge() > 0 && userAge > policy.getMaxAge())
            return false;

        String userSchoolCode = answers.get("Q2");
        if (policy.getSchoolCode() != null && !"0049010".equalsIgnoreCase(policy.getSchoolCode())) {
            if (!isSchoolEligible(userSchoolCode, policy.getSchoolCode()))
                return false;
        }

        String userBizCodes = answers.get("Q3");
        if (policy.getBizCode() != null && userBizCodes != null) {
            List<String> bizCodeList = Arrays.asList(userBizCodes.split(","));
            if (!"0014010".equals(policy.getBizCode()) && !bizCodeList.contains(policy.getBizCode()))
                return false;
        }

        String userMrgCode = answers.get("Q4");
        if (policy.getMrgCode() != null && !policy.getMrgCode().equals("55003")
                && !policy.getMrgCode().equalsIgnoreCase(userMrgCode))
            return false;

        String userJobCode = answers.get("Q5");
        if (policy.getJobCode() != null && !"0013010".equals(policy.getJobCode())
                && !policy.getJobCode().equalsIgnoreCase(userJobCode))
            return false;

        return true;
    }

    private boolean isSchoolEligible(String userSchoolCode, String policySchoolCode) {
        if ("0049010".equalsIgnoreCase(policySchoolCode))
            return true;
        try {
            int userCode = Integer.parseInt(userSchoolCode);
            int requiredCode = Integer.parseInt(policySchoolCode);
            return userCode <= requiredCode;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private Double calculateScore(PolicyScoreDto policy, Map<String, String> answers) {
        String answerBigCategory = answers.get("Q6");
        String answerMidCategory = answers.get("Q7");

        boolean bigMatch = answerBigCategory != null && answerBigCategory.equals(policy.getBigCategoryNm());
        boolean midMatch = answerMidCategory != null && answerMidCategory.equals(policy.getMidCategoryNm());

        if (bigMatch && midMatch)
            return 2.8;
        else if (bigMatch)
            return 2.3;
        else if (midMatch)
            return 2.5;
        else
            return 2.0;
    }

    private List<PolicyScoreDto> loadAllPolicies() {
        List<PolicyScoreDto> policyScoreTable = recommendationRepository.getAlgoColumn();
        if (policyScoreTable != null && !policyScoreTable.isEmpty()) {
            return policyScoreTable;
        } else {
            throw new RuntimeException("반환된 테이블이 없습니다");
        }
    }

    private List<String> determineTopRegions(Map<String, String> answers) {
        List<RecommendedRegionDto> infraDataList = recommendationRepository.findAllInfraData();

        for (RecommendedRegionDto region : infraDataList) {
            double score = 0.0;
            score += calculateScoreForQuestion(answers.get("Q8"), region.getInfra_medi_1());
            score += calculateScoreForQuestion(answers.get("Q9"), region.getInfra_medi_2());
            double transportScore = calculateScoreForQuestion(answers.get("Q11"), region.getInfra_traf());
            if ("Y".equalsIgnoreCase(answers.get("Q10")))
                transportScore *= 1.2;
            else if ("N".equalsIgnoreCase(answers.get("Q10")))
                transportScore *= 0.8;
            score += transportScore;

            double housingScore = calculateScoreForQuestion(answers.get("Q13"), region.getInfra_regi());
            if ("Y".equalsIgnoreCase(answers.get("Q12")))
                housingScore *= 0.8;
            else if ("N".equalsIgnoreCase(answers.get("Q12")))
                housingScore *= 1.2;
            score += housingScore;

            region.setTotInfraScore(score);
        }

        return infraDataList.stream()
                .sorted(Comparator.comparingDouble(RecommendedRegionDto::getTotInfraScore).reversed())
                .limit(3)
                .map(RecommendedRegionDto::getRegionCode)
                .toList();
    }

    private double calculateScoreForQuestion(String selectedGroupStr, String regionGradeStr) {
        if (selectedGroupStr == null || selectedGroupStr.isEmpty()
                || regionGradeStr == null || regionGradeStr.isEmpty())
            return 0;

        char selectedGroup = selectedGroupStr.charAt(0);
        char regionGrade = regionGradeStr.charAt(0);

        List<Character> priorityList = makePriorityList(selectedGroup);
        Map<Character, Double> weightMap = new HashMap<>();
        double[] weights = { 1.5, 1.2, 1.0, 0.8, 0.5 };
        for (int i = 0; i < priorityList.size(); i++) {
            weightMap.put(priorityList.get(i), weights[i]);
        }
        return weightMap.getOrDefault(regionGrade, 0.0);
    }

    private List<Character> makePriorityList(char selectedGroup) {
        return switch (selectedGroup) {
            case 'A' -> List.of('A', 'B', 'C', 'D', 'E');
            case 'B' -> List.of('B', 'A', 'C', 'D', 'E');
            case 'C' -> List.of('C', 'A', 'B', 'D', 'E');
            case 'D' -> List.of('D', 'E', 'C', 'B', 'A');
            case 'E' -> List.of('E', 'D', 'C', 'B', 'A');
            default -> new ArrayList<>();
        };
    }
}
