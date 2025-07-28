// package com.jibangyoung.domain.recommendation;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import com.jibangyoung.domain.recommendation.entity.Recommendation;
// import
// com.jibangyoung.domain.recommendation.service.RecommendationAlgorithmService;

// @Component
// public class RecommendationTestRunner implements CommandLineRunner {

// @Autowired
// private RecommendationAlgorithmService recommendationService;

// @Override
// public void run(String... args) {

// List<Recommendation> recommendations =
// recommendationService.generateRecommendations(1001L, 1L);

// recommendations
// .forEach(r -> System.out.println("테스트 추천: " + r.getRegionCode() + " -> 정책 코드:
// " + r.getPolicyCode()));
// }
// }