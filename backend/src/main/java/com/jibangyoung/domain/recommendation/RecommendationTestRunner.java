// package com.jibangyoung.domain.recommendation;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import com.jibangyoung.domain.recommendation.dto.RecommendationResultDto;
// import
// com.jibangyoung.domain.recommendation.service.RecommendationAlgorithmService;
// import com.jibangyoung.domain.recommendation.service.RecommendationService;

// @Component
// public class RecommendationTestRunner implements CommandLineRunner {

// @Autowired
// private RecommendationService recommendationService;

// @Autowired
// private RecommendationAlgorithmService recommendationAlgorithmService;

// @Override
// public void run(String... args) throws Exception {
// Long testUserId = 1001L;
// Long testResponseId = 1L;

// System.out.println("============= 추천 알고리즘 시작 =====================");
// recommendationAlgorithmService.generateRecommendations(testUserId,
// testResponseId);

// System.out.println("==== 추천 정책 결과 테스트 시작 ====");
// List<RecommendationResultDto> results = recommendationService
// .getRankedRecommendationsGroupedByRankGroup(testUserId, testResponseId);

// if (results.isEmpty()) {
// System.out.println("추천 결과가 없습니다.");
// } else {
// for (RecommendationResultDto dto : results) {
// System.out.println("---------------------------------------------------");
// System.out.printf("No: %d | RankGroup: %d | Rank: %d%n", dto.getNo(),
// dto.getRankGroup(),
// dto.getRank());
// System.out.printf("Region Code: %d | Region Name: %s%n", dto.getRegionCode(),
// dto.getRegionName());
// System.out.println("Region Descriptions:");
// if (dto.getRegionDescription() != null &&
// !dto.getRegionDescription().isEmpty()) {
// dto.getRegionDescription().forEach(desc -> System.out.println(" - " + desc));
// } else {
// System.out.println(" (정보 없음)");
// }

// System.out.println("Policies:");
// if (dto.getPolicies() != null && !dto.getPolicies().isEmpty()) {
// dto.getPolicies().forEach(policy -> {
// System.out.printf(" - 정책명: %s, 마감일: %s%n", policy.getPlcy_nm(),
// policy.getDeadline());
// });
// } else {
// System.out.println(" (정책 없음)");
// }
// }
// System.out.println("---------------------------------------------------");
// }
// System.out.println("==== 테스트 종료 ====");
// }
// }
