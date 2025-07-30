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
        // 중복 체크
        // 1. 설문 응답 조회 (Map<questionId, optionCode>)
        Map<String, String> answers = loadSurveyAnswers(userId, responseId);
        System.out.println("======설문 응답 결과중 두 코드만 반환");
        System.out.println(answers);

        // 2. 정책 필터링 및 점수화
        List<PolicyScoreDto> scoredPolicies = filterAndScorePolicies(answers);
        System.out.println("===============1차 필터링 결과===========");
        System.out.println("필터 통과 정책 개수: " + scoredPolicies.size());
        Map<Double, Long> scoreCounts = scoredPolicies.stream()
                .collect(Collectors.groupingBy(
                        PolicyScoreDto::getPoliscore,
                        Collectors.counting()));
        // 점수별 정책 개수 확인
        scoreCounts.forEach((score, count) -> System.out.println("점수 " + score + " : " + count + "개"));

        // 3. 인프라 기반 상위 지역 계산
        List<String> topRegions = determineTopRegions(answers);

        // 4. 상위 지역마다 상위 정책 4개씩 선택
        Map<String, List<PolicyScoreDto>> topPoliciesByRegion = new HashMap<>();

        for (String region : topRegions) {
            // 해당 지역 정책들만 필터링 후 점수 순으로 정렬
            List<PolicyScoreDto> regionPolicies = scoredPolicies.stream()
                    .filter(p -> p.getRegionCode().equals(region))
                    .sorted(Comparator.comparingDouble(PolicyScoreDto::getPoliscore).reversed())
                    .collect(Collectors.toList());

            // 4개 미만이면 전체 정책에서 점수순으로 추가
            if (regionPolicies.size() < 4) {
                int needed = 4 - regionPolicies.size();

                // 이미 추가된 정책을 제외한 전체 정책에서 높은 점수 순으로 선택
                List<PolicyScoreDto> additionalPolicies = scoredPolicies.stream()
                        .filter(p -> !p.getRegionCode().equals(region)) // 해당 지역 아닌 것
                        .filter(p -> !regionPolicies.contains(p)) // 이미 선택되지 않은 것
                        .sorted(Comparator.comparingDouble(PolicyScoreDto::getPoliscore).reversed())
                        .limit(needed)
                        .toList();

                regionPolicies.addAll(additionalPolicies);
            }

            // 상위 4개만 유지
            List<PolicyScoreDto> top4Policies = regionPolicies.stream()
                    .sorted(Comparator.comparingDouble(PolicyScoreDto::getPoliscore).reversed())
                    .limit(4)
                    .toList();

            topPoliciesByRegion.put(region, top4Policies);
        }
        // =================================================================================

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
        System.out.println("=============설문 응답 결과 조회=====================");
        System.out.println(answers);

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
        // policy 테이블에서 모든 정책에 대한 필터링 요소들 출력
        List<PolicyScoreDto> allPolicies = loadAllPolicies();

        // 1~5번 질문으로 필터링
        List<PolicyScoreDto> filtered = allPolicies.stream()
                .filter(p -> isPolicyEligible(p, answers))
                .toList();
        // 6~7번 질문으로 점수 계산
        return filtered.stream()
                .peek(p -> p.setPoliscore(calculateScore(p, answers)))
                .toList();
    }

    // 정책이 설문 응답에 적합한지 판단
    private boolean isPolicyEligible(PolicyScoreDto policy, Map<String, String> answers) {

        // 1. 나이 필터링 : MIN 나이보다 작거나, MAX 나이보다 큰 정책 필터링. 0은 연령제한 없음이므로 필터대상 아님
        int userAge = Integer.parseInt(answers.getOrDefault("Q1", "0"));
        if (policy.getMinAge() > 0 && userAge < policy.getMinAge()) {
            System.out.println("정책 번호 : " + policy.getPolicyCode() + ", 나이 불일치: userAge=" + userAge + ", minAge="
                    + policy.getMinAge());
            return false; // minAge > 0일 때만 제한
        }
        if (policy.getMaxAge() > 0 && userAge > policy.getMaxAge()) {
            System.out.println("정책 번호 : " + policy.getPolicyCode() + ", 나이 불일치: userAge=" + userAge + ", maxAge="
                    + policy.getMaxAge());
            return false; // maxAge > 0일 때만 제한
        }

        // 2. 학력 필터링 (선택한 코드 이상의 코드를 가지고 있는 정책들만 필터링(0049010번 제외))
        String userSchoolCode = answers.get("Q2");
        if (policy.getSchoolCode() != null && !"0049010".equalsIgnoreCase(policy.getSchoolCode())) {
            if (!isSchoolEligible(userSchoolCode, policy.getSchoolCode()))
                System.out.println(
                        "정책 번호 : " + policy.getPolicyCode() + ", 학력 불일치: userCode=" + userSchoolCode + ", plcyCode="
                                + policy.getSchoolCode());
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
                    System.out.println(
                            "정책 번호 : " + policy.getPolicyCode() + ", 특화 불일치: userCode=" + bizCodeList + ", plcyCode="
                                    + policy.getBizCode());
                    return false;
                }
            }
        }

        // 4. 결혼 상태 코드 필터링(선택한 옵션이 아닌 값만 제외(0055003 제외))
        String userMrgCode = answers.get("Q4");
        if (policy.getMrgCode() != null &&
                !policy.getMrgCode().equals("55003") &&
                !policy.getMrgCode().equalsIgnoreCase(userMrgCode)) {
            System.out.println(
                    "정책 번호 : " + policy.getPolicyCode() + ", 결혼 불일치: userCode=" + userMrgCode + ", plcyCode="
                            + policy.getMrgCode());
            return false;
        }

        // 5. 취업 요건 코드 필터링(제한 없음코드(0013010)은 제외)
        String userJobCode = answers.get("Q5");
        if (policy.getJobCode() != null &&
                !policy.getJobCode().equals("0013010") &&
                !policy.getJobCode().equalsIgnoreCase(userJobCode)) {
            System.out.println(
                    "정책 번호 : " + policy.getPolicyCode() + ", 결혼 불일치: userCode=" + userMrgCode + ", plcyCode="
                            + policy.getMrgCode());
            return false;
        }

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
    private Double calculateScore(PolicyScoreDto policy, Map<String, String> answers) {
        String answerBigCategory = answers.get("Q6"); // 6번 대분류명
        String answerMidCategory = answers.get("Q7"); // 7번 중분류명

        boolean bigMatch = answerBigCategory != null && answerBigCategory.equals(policy.getBigCategoryNm());
        boolean midMatch = answerMidCategory != null && answerMidCategory.equals(policy.getMidCategoryNm());

        if (bigMatch && midMatch) {
            return 2.8; // 대분류, 중분류 전부 일치
        } else if (bigMatch) {
            return 2.3; // 대분류만 일치
        } else if (midMatch) {
            return 2.5; // 중분류만 일치
        } else {
            return 2.0; // 둘다 불일치
        }
    }

    private List<PolicyScoreDto> loadAllPolicies() {
        // DB에서 정책 정보 로드(DTO 형식에 맞게)
        List<PolicyScoreDto> policyScoreTable = recommendationRepository.getAlgoColumn();
        // DB에서 가져온 정책이 있으면 그걸 반환, 없으면 임시 더미 데이터 반환
        if (policyScoreTable != null && !policyScoreTable.isEmpty()) {
            return policyScoreTable;
        } else {
            throw new RuntimeException("반환된 테이블이 없습니다");
        }

    }

    /**
     * 사용자의 설문 응답(answers)과 infra_data 테이블 데이터를 기반으로
     * 각 지역별 인프라 점수를 계산하여 상위 3개 지역을 추천한다.
     */
    private List<String> determineTopRegions(Map<String, String> answers) {
        // 1. DB에서 모든 지역의 인프라 데이터를 가져옴
        List<RecommendedRegionDto> infraDataList = recommendationRepository.findAllInfraData();
        System.out.println(infraDataList);

        // 2. 각 지역에 대해 점수 계산
        for (RecommendedRegionDto region : infraDataList) {
            double score = 0.0;

            // 2-1. Q8: 의료 인프라 점수
            score += calculateScoreForQuestion(answers.get("Q8"), region.getInfra_medi_1());

            // 2-2. Q9: 의료 접근성 점수
            score += calculateScoreForQuestion(answers.get("Q9"), region.getInfra_medi_2());

            // 2-3. Q11: 교통 인프라 점수 (추가 가중치 Q10 반영)
            double transportScore = calculateScoreForQuestion(answers.get("Q11"), region.getInfra_traf());
            if ("Y".equalsIgnoreCase(answers.get("Q10"))) {
                transportScore *= 1.2; // 대중교통을 선호 → 교통 인프라 가중치 ↑
            } else if ("N".equalsIgnoreCase(answers.get("Q10"))) {
                transportScore *= 0.8; // 대중교통을 선호하지 않음 → 교통 인프라 가중치 ↓
            }
            score += transportScore;

            // 2-4. Q13: 주거 인프라 점수 (추가 가중치 Q12 반영)
            double housingScore = calculateScoreForQuestion(answers.get("Q13"), region.getInfra_regi());
            if ("Y".equalsIgnoreCase(answers.get("Q12"))) {
                housingScore *= 0.8; // 현재 일하고 있음 → 주거 인프라 중요도 낮음
            } else if ("N".equalsIgnoreCase(answers.get("Q12"))) {
                housingScore *= 1.2; // 현재 일하지 않음 → 주거 인프라 중요도 높음
            }
            score += housingScore;

            // 2-5. 계산된 총 점수를 DTO에 저장
            region.setTotInfraScore(score);
        }
        // 3. 점수순으로 정렬 후 상위 3개 반환
        return infraDataList.stream()
                .sorted(Comparator.comparingDouble(RecommendedRegionDto::getTotInfraScore).reversed())
                .limit(3)
                .map(RecommendedRegionDto::getRegionCode) // RecommendedRegionDto → String(regionCode)
                .toList();
    }

    /**
     * 설문 선택 그룹과 지역 인프라 등급을 비교해 점수 계산
     */
    private double calculateScoreForQuestion(String selectedGroupStr, String regionGradeStr) {
        if (selectedGroupStr == null || regionGradeStr == null)
            return 0;

        char selectedGroup = selectedGroupStr.charAt(0); // 설문으로 선택한 인프라 등급 코드
        if (regionGradeStr == null || regionGradeStr.isEmpty()) { // 빈값이면 점수 계산에서 제외
            return 0;
        }
        char regionGrade = regionGradeStr.charAt(0); // DTO에 저장된 지역별 인프라 등급 코드

        // 1. 선택한 등급을 기준으로 우선순위 리스트 생성
        List<Character> priorityList = makePriorityList(selectedGroup);

        // 2. 우선순위 순으로 가중치 부여 (1순위 = 1.5, 2순위 = 1.2, ...)
        Map<Character, Double> weightMap = new HashMap<>();
        double[] weights = { 1.5, 1.2, 1.0, 0.8, 0.5 };
        for (int i = 0; i < priorityList.size(); i++) {
            weightMap.put(priorityList.get(i), weights[i]);
        }

        // 3. 각 등급별 가중치에서 지역 등급(regionGrade)에 해당하는 점수를 반환
        return weightMap.getOrDefault(regionGrade, 0.0);
    }

    /**
     * 선택 그룹 기준으로 우선순위 리스트 생성
     */
    private List<Character> makePriorityList(char selectedGroup) {
        List<Character> priorityList = new ArrayList<>();

        switch (selectedGroup) {
            case 'A':
                priorityList = List.of('A', 'B', 'C', 'D', 'E');
                break;
            case 'B':
                priorityList = List.of('B', 'A', 'C', 'D', 'E');
                break;
            case 'C':
                priorityList = List.of('C', 'A', 'B', 'D', 'E');
                break;
            case 'D':
                priorityList = List.of('D', 'E', 'C', 'B', 'A');
                break;
            case 'E':
                priorityList = List.of('E', 'D', 'C', 'B', 'A');
                break;
        }
        return priorityList;
    }

}
