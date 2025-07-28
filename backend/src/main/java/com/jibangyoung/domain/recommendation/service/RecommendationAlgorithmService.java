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
        // 1. 설문 응답 조회 (Map<questionId, optionCode>)
        Map<String, String> answers = loadSurveyAnswers(userId, responseId);

        // 2. 정책 필터링 및 점수화
        List<PolicyScoreDto> scoredPolicies = filterAndScorePolicies(answers);

        // 3. 인프라 기반 상위 지역 계산
        List<String> topRegions = determineTopRegions(answers);

        // 4. 상위 지역마다 상위 정책 4개씩 선택
        Map<String, List<PolicyScoreDto>> topPoliciesByRegion = new HashMap<>();

        for (String region : topRegions) {
            // 해당 지역에 속하는 정책만 필터링
            List<PolicyScoreDto> regionPolicies = scoredPolicies.stream()
                    .filter(p -> p.getRegionCode().equals(region)) // 정책의 regionCode와 일치
                    .sorted(Comparator.comparingDouble(PolicyScoreDto::getScore).reversed()) // 점수 내림차순
                    .limit(4) // 상위 4개 정책
                    .toList();

            topPoliciesByRegion.put(region, regionPolicies);
        }

        // 5. 추천 결과를 Recommendation 엔티티로 변환
        List<Recommendation> recommendations = new ArrayList<>();
        for (Map.Entry<String, List<PolicyScoreDto>> entry : topPoliciesByRegion.entrySet()) {
            String region = entry.getKey();
            for (PolicyScoreDto policy : entry.getValue()) {
                recommendations.add(Recommendation.builder()
                        .userId(userId)
                        .responseId(responseId)
                        .regionCode(region)
                        .policyCode(policy.getPolicyCode())
                        .build());
            }
        }

        // 6. DB에 저장하고 결과 반환
        return recommendationRepository.saveAll(recommendations);
    }

    // 설문 응답을 DB에서 조회하여 Map으로 변환
    private Map<String, String> loadSurveyAnswers(Long userId, Long responseId) {
        // SurveyAnswer 테이블에서 userId, responseId로 응답 조회
        List<SurveyAnswer> answers = surveyAnswerRepository.findByUserIdAndResponseId(userId, responseId);
        // surveyAnswer 테이블의 userid, responseid에 해당하는 모든 레코드들이 조회

        // questionId를 key, optionCode를 value로 변환 (중복응답의 경우 optionCode가 ,로 이어진 String이
        // 됨)
        return answers.stream()
                .collect(Collectors.toMap(
                        SurveyAnswer::getQuestionId,
                        SurveyAnswer::getOptionCode,
                        (existing, replacement) -> existing + "," + replacement // 중복 key일 경우 ,로 합침
                ));
    }

    // 정책을 필터링하고 점수를 계산
    private List<PolicyScoreDto> filterAndScorePolicies(Map<String, String> answers) {
        // TODO: policy 테이블에서 모든 정책 조회
        List<PolicyScoreDto> allPolicies = loadAllPolicies();

        // 1~5번 질문으로 필터링
        List<PolicyScoreDto> filtered = allPolicies.stream()
                .filter(p -> isPolicyEligible(p, answers))
                .toList();

        // 6~7번 질문으로 점수 계산
        return filtered.stream()
                .map(p -> new PolicyScoreDto(p.getPolicyCode(), calculateScore(p, answers)))
                .toList();
    }

    // 정책이 설문 응답에 적합한지 판단
    private boolean isPolicyEligible(PolicyScoreDto policy, Map<String, String> answers) {

        // 1. 나이 필터링 : MIN 나이보다 작거나, MAX 나이보다 크면 필터링 0은 연령제한 없음이므로 필터대상 아님
        int userAge = Integer.parseInt(answers.getOrDefault("Q1_age", "0"));
        if (policy.getMinAge() > 0 && userAge < policy.getMinAge())
            return false; // minAge > 0일 때만 제한
        if (policy.getMaxAge() > 0 && userAge > policy.getMaxAge())
            return false; // maxAge > 0일 때만 제한

        // 2. 학력 필터링 (선택한 코드 이상의 코드를 가지고 있는 정책들만 필터링)
        String userSchoolCode = answers.get("Q2");
        if (policy.getSchoolCode() != null && !"0049010".equalsIgnoreCase(policy.getSchoolCode())) {
            if (!isSchoolEligible(userSchoolCode, policy.getSchoolCode()))
                return false;
        }

        // 3. 특화 코드 필터링 (중복 선택 가능)
        String userBizCodes = answers.get("Q3");
        if (policy.getBizCode() != null && userBizCodes != null) {
            // 설문 응답에서 콤마로 분리하여 리스트화
            List<String> bizCodeList = Arrays.asList(userBizCodes.split(","));

            // 정책이 '제한없음' 코드(0014010)면 항상 통과
            if (!"0014010".equals(policy.getBizCode())) {
                // 제한없음이 아닌데 응답 목록에 포함되지 않으면 제외
                if (!bizCodeList.contains(policy.getBizCode())) {
                    return false;
                }
            }
        }

        // 4. 결혼 상태 코드 필터링
        String userMrgCode = answers.get("Q4_marriage");
        if (policy.getMrgCode() != null && !policy.getMrgCode().equalsIgnoreCase(userMrgCode))
            return false;

        // 5. 취업 요건 코드 필터링
        String userJobCode = answers.get("Q5_job");
        if (policy.getJobCode() != null && !policy.getJobCode().equalsIgnoreCase(userJobCode))
            return false;

        return true; // 모든 조건을 통과하면 추천 가능
    }

    // 학력 코드 판단 로직 (예시)
    private boolean isSchoolEligible(String userSchoolCode, String policySchoolCode) {
        // "0049010" : (학력상관없음 코드번호)
        if ("0049010".equalsIgnoreCase(policySchoolCode))
            return true;

        // 예시: 학력 코드가 숫자라면 숫자 이상의 코드들이 포함된 정책들만 선택/
        try {
            int userCode = Integer.parseInt(userSchoolCode);
            int requiredCode = Integer.parseInt(policySchoolCode);
            return userCode <= requiredCode;
        } catch (NumberFormatException e) {
            return false; // 코드 형식이 맞지 않으면 제외
        }
    }

    // 정책 점수를 계산
    private double calculateScore(PolicyScoreDto policy, Map<String, String> answers) {
        // TODO: 대분류, 중분류 비교 후 점수 계산
        return 2.0;
    }

    // 모든 정책 로드 (임시)
    private List<PolicyScoreDto> loadAllPolicies() {
        // TODO: DB에서 정책 정보 로드
        List<PolicyScoreDto> policyScoreTable = recommendationRepository.getAlgoColumn();
        // DB에서 가져온 정책이 있으면 그걸 반환, 없으면 임시 더미 데이터 반환
        if (policyScoreTable != null && !policyScoreTable.isEmpty()) {
            return policyScoreTable;
        } else {
            throw new Exception("반환된 테이블이 없습니다");
        }

    }

    // 인프라 데이터와 설문 응답을 기반으로 상위 3개 지역 결정
    private List<String> determineTopRegions(Map<String, String> answers) {
        // TODO: infra_data 테이블 조회 및 우선순위 결정 로직 구현
        return List.of("REGION1", "REGION2", "REGION3");
    }
}
